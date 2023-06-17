export const heQuestions = [
  {
    questionText: "Biopsy adequacy",
    questionType: "radio",
    choices: ["Yes", "No"],
  },
  {
    questionText: "If No, indicate Why?",
    questionType: "radio",
    choices: ["Not in Focus", "Faded/Poor Stain", "Other", "NA"],
  },
  {
    questionText: "Steatosis",
    questionType: "radio",
    choices: ["(0)<5%", "(1)5 - 33%", "(2)34 - 66%", "(3)>66%"],
  },
  {
    questionText: "Lobular inflammation",
    questionType: "radio",
    choices: [
      "(0)None",
      "(1)< 2 / 20x mag",
      "(2)2-4 / 20x mag",
      "(3)4/ 20x mag",
    ],
  },
  {
    questionText: "Hepatocellular ballooning",
    questionType: "radio",
    choices: ["(0)None", "(1)Few", "(2)Many"],
  },
  {
    questionText: "Hepatocellular ballooning",
    questionType: "text",
    choices: [],
  },
];

export const trichromeQuestions = [
  {
    questionText: "Biopsy adequacy",
    questionType: "radio",
    choices: ["Yes", "No"],
  },
  {
    questionText: "If No, indicate Why?",
    questionType: "radio",
    choices: ["Not in Focus", "Faded/Poor Stain", "Other", "NA"],
  },
  {
    questionText: "Biopsy Length",
    questionType: "text",
    choices: [],
  },
  {
    questionText: "Number of portal tracts",
    questionType: "text",
    choices: [],
  },
  {
    questionText: "NASH CRN",
    questionType: "radio",
    choices: [
      "None",
      "Mid, Zone 3, Perisinusoidal",
      "Zone 3 & periportal",
      "Bridging",
      "Cirrhosis",
      "Moderate, Zone 3, Perisinusoidal",
      "Portal / periportal only",
    ],
  },
];

export const questions = {
  "H&E": heQuestions,
  trichrome: trichromeQuestions,
};
