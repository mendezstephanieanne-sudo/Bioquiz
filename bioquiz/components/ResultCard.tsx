type ResultCardProps = {
	category: string;
	userName: string;
	totalQuestions: number;
	correctAnswers: number;
	incorrectAnswers: number;
	percentage: number;
	onRetake: () => void;
	onHome: () => void;
};

export default function ResultCard({
	category,
	userName,
	totalQuestions,
	correctAnswers,
	incorrectAnswers,
	percentage,
	onRetake,
	onHome,
}: ResultCardProps) {
	return (
		<div className="result-panel">
			<div className="result-orbit">✦</div>
			<p className="eyebrow">Quiz complete</p>
			<h1>You made it<br /><em>through.</em></h1>
			<p className="result-greeting">Nice work, {userName.split(" ")[0]}. Here is your field note.</p>
			<div className="score-block">
				<span className="score-label">Final score</span>
				<strong>{correctAnswers}<small> / {totalQuestions}</small></strong>
				<span className="score-percent">{percentage}% correct</span>
			</div>
			<div className="result-stats" aria-label="Quiz results">
				<div><span>Total questions</span><strong>{totalQuestions}</strong></div>
				<div><span>Correct answers</span><strong>{correctAnswers}</strong></div>
				<div><span>Incorrect answers</span><strong>{incorrectAnswers}</strong></div>
			</div>
			<div className="result-category"><span>Subject</span><strong>{category}</strong></div>
			<div className="result-actions">
				<button className="primary-button" onClick={onRetake}>Retake quiz →</button>
				<button className="text-button" onClick={onHome}>Return home</button>
			</div>
		</div>
	);
}