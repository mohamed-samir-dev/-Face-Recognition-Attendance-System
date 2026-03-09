"use client";

import CameraControls from "../../../components/CameraControls";
import {ControlsSectionProps}from "../../../types"

export default function ControlsSection(props: ControlsSectionProps) {
  const { detecting, mode, checkedOut, ...controlsProps } = props;
  
  return (
    <CameraControls
      {...controlsProps}
      mode={mode}
      checkedOut={checkedOut}
      isProcessing={props.isProcessing || detecting}
    />
  );
}