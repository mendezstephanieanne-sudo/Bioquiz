type AnswerOptionProps = {
	letter: string;
	text: string;
	selected: boolean;
	onSelect: () => void;
};

export default function AnswerOption({
	letter,
	text,
	selected,
	onSelect,
}: AnswerOptionProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={`choice ${selected ? "selected" : ""}`}
			aria-pressed={selected}
		>
			<span className="choice-letter">{letter}</span>
			<span>{text}</span>
			<span className="choice-check">{selected ? "✓" : ""}</span>
		</button>
	);
}