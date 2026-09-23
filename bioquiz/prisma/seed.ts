import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SeedQuestion = {
  question: string;
  correct: string;
  wrong: [string, string, string];
  difficulty?: string;
};

type SeedCategory = {
  name: string;
  description: string;
  questions: SeedQuestion[];
};

const q = (question: string, correct: string, wrong: [string, string, string], difficulty = "Easy"): SeedQuestion => ({ question, correct, wrong, difficulty });

const categories: SeedCategory[] = [
  {
    name: "Cell Biology",
    description: "The tiny machinery that makes life possible.",
    questions: [
      q("What is the basic unit of life?", "Cell", ["Tissue", "Organ", "Organism"]),
      q("Which organelle is known as the powerhouse of the cell?", "Mitochondrion", ["Nucleus", "Ribosome", "Golgi apparatus"]),
      q("Which structure controls what enters and leaves a cell?", "Cell membrane", ["Cell wall", "Nucleolus", "Cytoplasm"]),
      q("Where are proteins assembled?", "Ribosomes", ["Lysosomes", "Vacuoles", "Centrioles"]),
      q("What molecule stores genetic information in most organisms?", "DNA", ["ATP", "Glucose", "Lipids"]),
      q("Which organelle contains most of a cell's DNA?", "Nucleus", ["Mitochondrion", "Chloroplast", "Vacuole"]),
      q("What process do cells use to divide into two identical daughter cells?", "Mitosis", ["Meiosis", "Osmosis", "Transcription"]),
      q("What is the jelly-like material filling much of a cell?", "Cytoplasm", ["Chromatin", "Cellulose", "Plasma"]),
      q("Which organelle breaks down worn-out cell parts?", "Lysosome", ["Ribosome", "Centrosome", "Nucleolus"]),
      q("What is the movement of water across a selectively permeable membrane called?", "Osmosis", ["Diffusion", "Active transport", "Endocytosis"]),
    ],
  },
  {
    name: "Genetics",
    description: "DNA, inheritance, and the code of life.",
    questions: [
      q("What does DNA stand for?", "Deoxyribonucleic acid", ["Double nitrogen acid", "Dynamic nucleic atom", "Deoxygenated ribose acid"]),
      q("What is a segment of DNA that codes for a trait called?", "Gene", ["Allele pair", "Chromosome", "Codon"]),
      q("Which base pairs with adenine in DNA?", "Thymine", ["Cytosine", "Guanine", "Uracil"]),
      q("What is the observable expression of a person's genes called?", "Phenotype", ["Genotype", "Karyotype", "Genome"]),
      q("Who is known for pea plant experiments that established inheritance laws?", "Gregor Mendel", ["Charles Darwin", "Rosalind Franklin", "Louis Pasteur"]),
      q("What molecule carries genetic instructions from DNA to a ribosome?", "Messenger RNA", ["Transfer DNA", "ATP", "Lipase"]),
      q("Different versions of the same gene are called what?", "Alleles", ["Codons", "Centromeres", "Histones"]),
      q("How many chromosomes are normally found in a human body cell?", "46", ["23", "44", "92"]),
      q("What type of mutation changes one DNA base?", "Point mutation", ["Chromosomal crossover", "Polyploidy", "Nondisjunction"]),
      q("What is the passing of traits from parents to offspring called?", "Heredity", ["Evolution", "Adaptation", "Homeostasis"]),
    ],
  },
  {
    name: "Human Anatomy",
    description: "A closer look at the remarkable human body.",
    questions: [
      q("Which organ pumps blood around the body?", "Heart", ["Lung", "Liver", "Kidney"]),
      q("What is the largest organ of the human body?", "Skin", ["Liver", "Small intestine", "Brain"]),
      q("Which organ is primarily responsible for gas exchange?", "Lungs", ["Stomach", "Pancreas", "Spleen"]),
      q("What is the main function of red blood cells?", "Carry oxygen", ["Fight infection", "Clot blood", "Digest fats"]),
      q("Which bone protects the brain?", "Skull", ["Sternum", "Femur", "Pelvis"]),
      q("Where does most nutrient absorption occur?", "Small intestine", ["Stomach", "Large intestine", "Esophagus"]),
      q("Which system sends rapid electrical signals through the body?", "Nervous system", ["Endocrine system", "Digestive system", "Lymphatic system"]),
      q("What connects a muscle to a bone?", "Tendon", ["Ligament", "Cartilage", "Nerve"]),
      q("Which organ filters waste from the blood to make urine?", "Kidney", ["Gallbladder", "Appendix", "Thyroid"]),
      q("What is the basic contractile unit of skeletal muscle?", "Sarcomere", ["Neuron", "Alveolus", "Nephron"]),
    ],
  },
  {
    name: "Botany",
    description: "Plants, photosynthesis, and green systems.",
    questions: [
      q("What pigment makes most plants green?", "Chlorophyll", ["Keratin", "Melanin", "Hemoglobin"]),
      q("What process lets plants convert light energy into chemical energy?", "Photosynthesis", ["Respiration", "Transpiration", "Fermentation"]),
      q("Which plant tissue transports water upward?", "Xylem", ["Phloem", "Epidermis", "Cambium"]),
      q("Which plant tissue transports sugars?", "Phloem", ["Xylem", "Cork", "Meristem"]),
      q("What gas do plants take in for photosynthesis?", "Carbon dioxide", ["Oxygen", "Nitrogen", "Hydrogen"]),
      q("What part of a flower produces pollen?", "Anther", ["Stigma", "Sepal", "Ovary"]),
      q("What is the loss of water vapor from plant leaves called?", "Transpiration", ["Germination", "Pollination", "Fertilization"]),
      q("Which structure anchors a plant and absorbs water?", "Root", ["Stem", "Flower", "Fruit"]),
      q("What is the first stage of a seed growing into a plant?", "Germination", ["Maturation", "Pollination", "Dormancy"]),
      q("What opening on a leaf controls gas exchange?", "Stoma", ["Node", "Petal", "Root hair"]),
    ],
  },
  {
    name: "Microbiology",
    description: "The hidden world of microbes.",
    questions: [
      q("Which microorganism is made of a single cell without a nucleus?", "Bacterium", ["Virus", "Mushroom", "Protozoan"]),
      q("What is the protein shell around a virus called?", "Capsid", ["Cell wall", "Nucleoid", "Flagellum"]),
      q("Which organisms are used to make bread rise?", "Yeast", ["Algae", "Mosses", "Nematodes"]),
      q("What process kills many harmful microbes in milk using heat?", "Pasteurization", ["Filtration", "Fermentation", "Incubation"]),
      q("Which bacterial shape is spherical?", "Coccus", ["Bacillus", "Spirillum", "Vibrio"]),
      q("What do antibiotics primarily target?", "Bacteria", ["All viruses", "Human red blood cells", "Plant seeds"]),
      q("Which microbe causes malaria?", "Plasmodium", ["Influenza virus", "E. coli", "Candida"]),
      q("What is the study of microorganisms called?", "Microbiology", ["Morphology", "Meteorology", "Mythology"]),
      q("Which structure helps some bacteria move?", "Flagellum", ["Capsid", "Pilus cap", "Chloroplast"]),
      q("What is a community of microorganisms attached to a surface called?", "Biofilm", ["Mycelium", "Capsomere", "Colony wall"]),
    ],
  },
  {
    name: "Zoology",
    description: "Life in motion, from insects to mammals.",
    questions: [
      q("What is the largest animal known to have lived?", "Blue whale", ["African elephant", "Giraffe", "Giant squid"]),
      q("Animals with a backbone are called what?", "Vertebrates", ["Invertebrates", "Arthropods", "Mollusks"]),
      q("What group do frogs belong to?", "Amphibians", ["Reptiles", "Mammals", "Birds"]),
      q("Which animal is known for metamorphosis from caterpillar to adult?", "Butterfly", ["Dolphin", "Lizard", "Eagle"]),
      q("What do herbivores primarily eat?", "Plants", ["Other animals", "Fungi only", "Minerals"]),
      q("Which body covering is characteristic of birds?", "Feathers", ["Scales", "Fur", "Moist skin"]),
      q("What is the scientific study of animal behavior called?", "Ethology", ["Ecology", "Embryology", "Entomology"]),
      q("Which animal group has jointed legs and an exoskeleton?", "Arthropods", ["Echinoderms", "Annelids", "Cnidarians"]),
      q("What do fish use primarily to extract oxygen from water?", "Gills", ["Lungs", "Tracheae", "Skin scales"]),
      q("Which mammal lays eggs?", "Platypus", ["Kangaroo", "Dolphin", "Bat"]),
    ],
  },
  {
    name: "Ecology",
    description: "The relationships that shape every habitat.",
    questions: [
      q("What is the role an organism plays in its ecosystem called?", "Niche", ["Biome", "Habitat", "Population"]),
      q("Organisms that make their own food are called what?", "Producers", ["Consumers", "Decomposers", "Scavengers"]),
      q("What is the first trophic level usually made up of?", "Plants", ["Carnivores", "Decomposers", "Parasites"]),
      q("What is a group of the same species living in one area?", "Population", ["Community", "Ecosystem", "Biosphere"]),
      q("What process returns nitrogen compounds to the atmosphere?", "Denitrification", ["Photosynthesis", "Transpiration", "Glycolysis"]),
      q("What is the variety of life in an area called?", "Biodiversity", ["Biomass", "Succession", "Carrying capacity"]),
      q("Which relationship benefits both species?", "Mutualism", ["Parasitism", "Predation", "Competition"]),
      q("What is the maximum population an environment can support called?", "Carrying capacity", ["Growth rate", "Food web", "Limiting factor"]),
      q("What organisms break down dead material and recycle nutrients?", "Decomposers", ["Producers", "Herbivores", "Pollinators"]),
      q("What is the gradual change in a community over time called?", "Ecological succession", ["Natural selection", "Migration", "Mutation"]),
    ],
  },
  {
    name: "General Biology",
    description: "A little bit of everything, beautifully connected.",
    questions: [
      q("Which molecule is the main immediate energy currency of cells?", "ATP", ["DNA", "Cellulose", "Cholesterol"]),
      q("What is maintaining a stable internal environment called?", "Homeostasis", ["Evolution", "Digestion", "Speciation"]),
      q("Which level of organization is made of similar cells working together?", "Tissue", ["Organ", "Organ system", "Organism"]),
      q("What force pulls objects toward Earth?", "Gravity", ["Friction", "Magnetism", "Buoyancy"]),
      q("What is the process by which populations change over generations?", "Evolution", ["Respiration", "Circulation", "Excretion"]),
      q("Which macromolecule includes enzymes?", "Protein", ["Carbohydrate", "Lipid", "Nucleic acid"]),
      q("What is the first step of the scientific method after observing a pattern?", "Ask a question", ["Publish results", "Change the data", "Skip experimentation"]),
      q("What kind of relationship involves one organism benefiting while the other is harmed?", "Parasitism", ["Mutualism", "Commensalism", "Cooperation"]),
      q("Which process releases energy from glucose in cells?", "Cellular respiration", ["Photosynthesis", "Replication", "Translation"]),
      q("What term describes an organism that can make fertile offspring with another organism?", "Same species", ["Same population", "Same ecosystem", "Same niche"]),
    ],
  },
];

async function main() {
  console.log("Starting database seed...");
  const password = await bcrypt.hash("bioquiz123", 10);
  const user = await prisma.user.upsert({
    where: { email: "user@bioquiz.com" },
    update: {},
    create: { name: "BioQuiz User", email: "user@bioquiz.com", password },
  });
  console.log(`User ready: ${user.email}`);

  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: { description: categoryData.description },
      create: { name: categoryData.name, description: categoryData.description },
    });

    for (const item of categoryData.questions) {
      const choices = [item.correct, ...item.wrong].map((text) => ({
        text,
        isCorrect: text === item.correct,
      }));
      const existing = await prisma.question.findFirst({ where: { categoryId: category.id, question: item.question } });
      if (existing) {
        await prisma.choice.deleteMany({ where: { questionId: existing.id } });
        await prisma.question.update({
          where: { id: existing.id },
          data: { difficulty: item.difficulty ?? "Easy", choices: { create: choices } },
        });
      } else {
        await prisma.question.create({
          data: {
            categoryId: category.id,
            question: item.question,
            difficulty: item.difficulty ?? "Easy",
            choices: { create: choices },
          },
        });
      }
    }
    console.log(`${category.name}: ${categoryData.questions.length} questions ready`);
  }
  console.log("Seed completed: 8 categories, 80 questions.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
