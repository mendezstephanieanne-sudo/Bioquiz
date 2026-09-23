type Choice = {
	id: number;
	text: string;
};

import AnswerOption from "@/components/AnswerOption";

type QuestionCardProps = {
	questionNumber: number;
	question: string;
	difficulty: string;
	choices: Choice[];
	selectedChoice: number | null;
	onSelect: (choiceId: number) => void;
};

export default function QuestionCard({
	questionNumber,
	question,
	difficulty,
	choices,
	selectedChoice,
	onSelect,
}: QuestionCardProps) {
	return (
		<>
			<div className="question-meta">
				<span className="tag">Question {questionNumber}</span>
				<span className="difficulty">{difficulty}</span>
			</div>
			<h2>{question}</h2>
			<div className="choice-list">
				{choices.map((choice, index) => {
					const selected = choice.id === selectedChoice;

					return (
						<AnswerOption
							key={choice.id}
							letter={String.fromCharCode(65 + index)}
							text={choice.text}
							selected={selected}
							onSelect={() => onSelect(choice.id)}
						/>
					);
				})}
			</div>
		</>
	);
}
