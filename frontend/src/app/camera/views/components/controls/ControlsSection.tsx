"use client";

import CameraControls from "../../../components/CameraControls";
import {ControlsSectionProps}from "../../../types"

export default function ControlsSection(props: ControlsSectionProps) {
  const { detecting, mode, ...controlsProps } = props;
  
  return (
    <CameraControls
      {...controlsProps}
      mode={mode}
      isProcessing={props.isProcessing || detecting}
    />
  );
}