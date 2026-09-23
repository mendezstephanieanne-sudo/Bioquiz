type ProgressBarProps = {
	current: number;
	total: number;
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
	const progress = total > 0 ? (current / total) * 100 : 0;

	return (
		<div
			className="progress-track"
			role="progressbar"
			aria-label={`Question ${current} of ${total}`}
			aria-valuemin={0}
			aria-valuemax={total}
			aria-valuenow={current}
		>
			<div className="progress-fill" style={{ width: `${progress}%` }} />
		</div>
	);
}
