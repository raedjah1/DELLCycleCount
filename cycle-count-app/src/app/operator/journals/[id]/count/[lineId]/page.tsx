// ============================================================================
// COUNT INTERFACE - Refactored with modular widgets
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { JournalService, JournalLine, CountSubmission } from '@/lib/services/journalService';
import { ItemInfoCard } from '@/components/widgets/operator/ItemInfoCard/ItemInfoCard';
import { CountInput } from '@/components/widgets/operator/CountInput/CountInput';
import { SerialCapture } from '@/components/widgets/operator/SerialCapture/SerialCapture';
import { PhotoCapture } from '@/components/widgets/operator/PhotoCapture/PhotoCapture';
import { SubmitButton } from '@/components/widgets/operator/SubmitButton/SubmitButton';
import { PreviousCountsCard } from '@/components/widgets/operator/PreviousCountsCard/PreviousCountsCard';
import { LoadingSpinner } from '@/components/widgets/operator/LoadingSpinner/LoadingSpinner';

export default function CountScreenPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useCurrentUser();
  
  const [line, setLine] = useState<JournalLine | null>(null);
  const [countSubmissions, setCountSubmissions] = useState<CountSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [countValue, setCountValue] = useState<string>('');
  const [serialNumbers, setSerialNumbers] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const journalId = params.id as string;
  const lineId = params.lineId as string;

  useEffect(() => {
    if (lineId && user?.id) {
      loadLineData();
    }
  }, [lineId, user?.id]);

  const loadLineData = async () => {
    try {
      setLoading(true);
      const [lineData, submissions] = await Promise.all([
        JournalService.getJournalLine(lineId),
        JournalService.getCountSubmissions(lineId)
      ]);
      
      setLine(lineData);
      setCountSubmissions(submissions);
      
      // Auto-claim line if unstarted
      if (lineData.status === 'Unstarted' && user?.id) {
        await JournalService.claimJournalLine(lineId, user.id);
        lineData.status = 'In Progress';
        lineData.claimed_by = user.id;
        lineData.claimed_at = new Date().toISOString();
        setLine(lineData);
      }
    } catch (error) {
      console.error('Failed to load line data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentCountNumber = (): 'Count 1' | 'Count 2' | 'Count 3' => {
    const count1 = countSubmissions.find(s => s.count_type === 'Count 1');
    const count2 = countSubmissions.find(s => s.count_type === 'Count 2');
    
    if (!count1) return 'Count 1';
    if (!count2) return 'Count 2';
    return 'Count 3';
  };

  const getVarianceFromExpected = (value: number) => {
    if (!line) return 0;
    return value - line.expected_qty;
  };

  const isFinishedGoodsMismatch = () => {
    if (!line) return false;
    const variance = getVarianceFromExpected(parseInt(countValue) || 0);
    return line.item.warehouse_type === 'Finishedgoods' && variance !== 0;
  };

  const requiresSerialNumbers = () => {
    return line?.item.serial_flag === 'Y';
  };

  const addSerialNumber = (serial: string) => {
    if (!serialNumbers.includes(serial)) {
      setSerialNumbers([...serialNumbers, serial]);
    }
  };

  const removeSerialNumber = (index: number) => {
    setSerialNumbers(serialNumbers.filter((_, i) => i !== index));
  };

  const validateSubmission = () => {
    if (!countValue.trim()) return 'Count value is required';
    if (isNaN(parseInt(countValue))) return 'Count value must be a number';
    if (parseInt(countValue) < 0) return 'Count value cannot be negative';
    
    if (requiresSerialNumbers() && parseInt(countValue) > 0) {
      if (serialNumbers.length !== parseInt(countValue)) {
        return `Serial numbers required: ${parseInt(countValue)} expected, ${serialNumbers.length} provided`;
      }
    }
    
    if (isFinishedGoodsMismatch() && !photoFile) {
      return 'Photo evidence is required for Finished Goods mismatches';
    }
    
    return null;
  };

  const handleSubmit = async () => {
    if (!line || !user?.id) return;
    
    const validationError = validateSubmission();
    if (validationError) {
      alert(validationError);
      return;
    }
    
    try {
      setSubmitting(true);
      
      const countType = getCurrentCountNumber();
      const countVal = parseInt(countValue);
      
      // Upload photo if needed
      let photoUrl: string | undefined;
      if (photoFile) {
        photoUrl = await JournalService.uploadVariancePhoto(photoFile, lineId);
      }
      
      // Submit count
      await JournalService.submitCount(
        lineId,
        countVal,
        countType,
        user.id,
        notes.trim() || undefined,
        photoUrl
      );
      
      // Capture serial numbers if required
      if (requiresSerialNumbers() && serialNumbers.length > 0) {
        await JournalService.captureSerialNumbers(lineId, serialNumbers, user.id);
      }
      
      // Navigate to next line or journal
      const nextLine = await getNextLine();
      if (nextLine) {
        router.push(`/operator/journals/${journalId}/count/${nextLine.id}`);
      } else {
        router.push(`/operator/journals/${journalId}`);
      }
      
    } catch (error) {
      console.error('Failed to submit count:', error);
      alert('Failed to submit count. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getNextLine = async () => {
    try {
      const journal = await JournalService.getJournalWithLines(journalId);
      const currentIndex = journal.lines.findIndex(l => l.id === lineId);
      
      // Find next unstarted or needs recount
      for (let i = currentIndex + 1; i < journal.lines.length; i++) {
        const line = journal.lines[i];
        if (line.status === 'Unstarted' || line.status === 'Needs Recount') {
          return line;
        }
      }
      
      // Look from beginning
      for (let i = 0; i < currentIndex; i++) {
        const line = journal.lines[i];
        if (line.status === 'Unstarted' || line.status === 'Needs Recount') {
          return line;
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  };

  const currentCountType = getCurrentCountNumber();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner message="Loading count screen..." className="min-h-screen" />
      </div>
    );
  }

  if (!line) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Line Not Found</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div className="text-right">
              <span className="text-sm text-gray-600">Sequence</span>
              <p className="text-lg font-bold text-gray-900">#{line.sequence_number}</p>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">{line.location.location_code}</h1>
            <p className="text-gray-600">{line.item.part_no}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Item Info */}
        <ItemInfoCard line={line} />

        {/* Previous Counts */}
        <PreviousCountsCard submissions={countSubmissions} />

        {/* Count Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">{currentCountType}</h3>
          
          {/* Count Input */}
          <CountInput
            value={countValue}
            onChange={setCountValue}
            expectedQty={line.expected_qty}
            className="mb-6"
          />

          {/* Serial Number Capture */}
          {requiresSerialNumbers() && parseInt(countValue) > 0 && (
            <SerialCapture
              serialNumbers={serialNumbers}
              onAddSerial={addSerialNumber}
              onRemoveSerial={removeSerialNumber}
              expectedCount={parseInt(countValue)}
              className="mb-6"
            />
          )}

          {/* Photo Capture for Finished Goods Mismatches */}
          {isFinishedGoodsMismatch() && (
            <PhotoCapture
              photoFile={photoFile}
              photoPreview={photoPreview}
              onPhotoChange={(file, preview) => {
                setPhotoFile(file);
                setPhotoPreview(preview);
              }}
              required={true}
              className="mb-6"
            />
          )}

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Any additional comments..."
            />
          </div>

          {/* Submit Button */}
          <SubmitButton
            onSubmit={handleSubmit}
            disabled={!countValue.trim()}
            loading={submitting}
            label={`Submit ${currentCountType}`}
          />
        </div>
      </div>
    </div>
  );
}