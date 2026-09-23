type QuizHeaderProps = {
	category: string;
	onHome: () => void;
};

export default function QuizHeader({ category, onHome }: QuizHeaderProps) {
	return (
		<header className="quiz-topbar">
			<button className="brand-mark" onClick={onHome}>
				<span>Bio</span>Quiz
			</button>
			<span className="quiz-category">{category}</span>
		</header>
	);
}