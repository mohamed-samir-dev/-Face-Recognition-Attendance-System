'use client';

import { SectionHeader, UploadButton, ResetButton, MessageAlert } from './components';
import {FacialDataSectionProps}from "../../../types"



export default function FacialDataSection({
  updating,
  hasNewPhoto,
  photoMessage,
  onPhotoUpload,
  onResetClick
}: FacialDataSectionProps) {
  return (
    <div>
      <SectionHeader />
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <UploadButton updating={updating} onPhotoUpload={onPhotoUpload} />
        <ResetButton hasNewPhoto={hasNewPhoto} onResetClick={onResetClick} />
      </div>
      <MessageAlert message={photoMessage} />
    </div>
  );
}