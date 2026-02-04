import ActionButton from "../actions/ActionButton";

interface RetryButtonProps {
  onRetry: () => void;
}

export default function RetryButton({ onRetry }: RetryButtonProps) {
  return (
    <ActionButton onClick={onRetry}>
      Retry
    </ActionButton>
  );
}