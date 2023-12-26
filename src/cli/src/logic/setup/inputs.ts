import inquirer from "inquirer";
import moment from 'moment'
import { MeliBUs } from "../../enums/MeliBusinessUnits";
import { WorktimeProviderOptions } from "../../providers/types";
import { CLIError } from "@oclif/errors";
import { WorktimeProviderName } from "../../enums/WorktimeProviderName";

export const OTHER = "Outro";
export const AHGORA = "Ahgora";

export function meliFluxSecondStep(): inquirer.QuestionCollection[] {
  return [
    {
      name: "whichMeli",
      message: "Para qual BU você trabalha?",
      type: "list",
      choices: [
        {
          name: MeliBUs.MARKETPLACE.name,
          value: MeliBUs.MARKETPLACE.code
        },
        {
          name: MeliBUs.MERCADO_ENVIOS.name,
          value: MeliBUs.MERCADO_ENVIOS.code,
        },
      ],
    },
    {
      name: "isDefaultMeliWorktime",
      message: "Você tem o expediente padrão do Meli (08:48)?",
      type: "confirm",
      default: true,
    },
  ].concat(inquireAhgoraCredentials()) as inquirer.QuestionCollection[];
}

export function otherCompaniesFluxSecondStep(): inquirer.QuestionCollection[] {
  const providersAsChoices = [{ name: WorktimeProviderName.AHGORA }];
  if (process.env.NODE_ENV === 'development') {
    providersAsChoices.push({ name: WorktimeProviderName.FAKER })
  }

  return [
    {
      name: "provider",
      message: "Selecione um sistema de pontos",
      type: "list",
      choices: providersAsChoices,
    },
    {
      name: "journeytime",
      message: "Selecione o período da sua jornada de trabalho",
      type: "list",
      choices: [
        { name: "08:00" },
        { name: "08:48" },
        { name: "06:00" },
        // { name: OTHER }, // TODO: review this option to add another step to inform the journey time
      ],
    },
    {
      name: "ahgoraCompanyId",
      message: 'Digite o código da sua empresa no sistema de ponto',
      type: "input",
    },
  ] as inquirer.QuestionCollection[];
}

export function inquireAhgoraCredentials(): any {
  return [
    {
      name: "ahgoraUsername",
      message: "Digite o código do seu usuário no Ahgora (RE):",
      type: "input",
    },
    {
      name: "ahgoraPassword",
      message: "Digite sua senha do Ahgora:",
      type: "password",
      mask: "*",
    },
  ] as inquirer.QuestionCollection[];
}

export function inquireCustomJourneyTime(): any {
  return [
    {
      name: "customJourneytime",
      message: "Especifique sua jornada de trabalho no formato HH:MM :",
      type: "input",
    },
  ] as inquirer.QuestionCollection[];
}

export function meliFluxThirdStep(secondStepInquirer: any): inquirer.QuestionCollection[] {
  if (secondStepInquirer.isDefaultMeliWorktime === false) {
    return inquireCustomJourneyTime();
  }
  return [] as inquirer.QuestionCollection[];
}

export function otherCompaniesFluxThirdStep(secondStepInquirer: any): inquirer.QuestionCollection[] {
  var inquiries = [] as inquirer.QuestionCollection[];

  if (secondStepInquirer.journeytime === OTHER) {
    inquiries = inquiries.concat(inquireCustomJourneyTime());
  }

  if (secondStepInquirer.provider === AHGORA) {
    inquiries = inquiries.concat(inquireAhgoraCredentials());
  }

  return inquiries;
}

export function meliFluxGenerateOptions(secondStepInquirer: any, thirdStepInquirer: any): WorktimeProviderOptions {
  return {
    userId: secondStepInquirer.ahgoraUsername,
    password: secondStepInquirer.ahgoraPassword,
    systemId: WorktimeProviderName.AHGORA.toLowerCase(),
    companyId: secondStepInquirer.whichMeli,
    date: moment().format("YYYY-MM-DD"),
    debug: false,
    journeyTime: secondStepInquirer.isDefaultMeliWorktime ? "08:48" : thirdStepInquirer.customJourneytime,
    momentDate: moment(),
  };
}

export function otherCompaniesGenerateOptions(secondStepInquirer: any, thirdStepInquirer: any): WorktimeProviderOptions {
  if (secondStepInquirer.provider === AHGORA) {
    return {
      userId: thirdStepInquirer.ahgoraUsername,
      password: thirdStepInquirer.ahgoraPassword,
      systemId: "ahgora",
      companyId: secondStepInquirer.ahgoraCompanyId,
      date: moment().format("YYYY-MM-DD"),
      debug: false,
      journeyTime: secondStepInquirer.journeytime !== OTHER ? secondStepInquirer.journeytime : thirdStepInquirer.customJourneytime,
      momentDate: moment(),
    };
  } else {
    throw new CLIError("Somente o Ahgora é suportado no momento!");
  }
}

export function meliFluxGetPassword(secondStepInquirer: any, thirdStepInquirer: any): String {
  return secondStepInquirer.ahgoraPassword
}

export function otherCompaniesGetPassword(secondStepInquirer: any, thirdStepInquirer: any): String {
  return thirdStepInquirer.ahgoraPassword
}
