
const CLIError = require('@oclif/core/handle');
import { QuestionCollection } from "inquirer";
import moment from 'moment'

import { MeliBUs } from "../../enums/MeliBusinessUnits.js";
import { WorktimeProviderName } from "../../enums/WorktimeProviderName.js";
import { WorktimeProviderOptions } from "../../providers/types.js";

export const OTHER = "Outro";
export const AHGORA = "Ahgora";

export function meliFluxSecondStep(): QuestionCollection[] {
  return [
    {
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
      message: "Para qual BU você trabalha?",
      name: "whichMeli",
      type: "list",
    },
    {
      default: true,
      message: "Você tem o expediente padrão do Meli (08:48)?",
      name: "isDefaultMeliWorktime",
      type: "confirm",
    },
  ].concat(inquireAhgoraCredentials()) as QuestionCollection[];
}

export function otherCompaniesFluxSecondStep(): QuestionCollection[] {
  const providersAsChoices = [{ name: WorktimeProviderName.AHGORA }];
  if (process.env.NODE_ENV === 'development') {
    providersAsChoices.push({ name: WorktimeProviderName.FAKER })
  }

  return [
    {
      choices: providersAsChoices,
      message: "Selecione um sistema de pontos",
      name: "provider",
      type: "list",
    },
    {
      choices: [
        { name: "08:00" },
        { name: "08:48" },
        { name: "06:00" },
        // { name: OTHER }, // TODO: review this option to add another step to inform the journey time
      ],
      message: "Selecione o período da sua jornada de trabalho",
      name: "journeytime",
      type: "list",
    },
    {
      message: 'Digite o código da sua empresa no sistema de ponto',
      name: "ahgoraCompanyId",
      type: "input",
    },
  ] as QuestionCollection[];
}

export function inquireAhgoraCredentials(): any {
  return [
    {
      message: "Digite o código do seu usuário no Ahgora (RE):",
      name: "ahgoraUsername",
      type: "input",
    },
    {
      mask: "*",
      message: "Digite sua senha do Ahgora:",
      name: "ahgoraPassword",
      type: "password",
    },
  ] as QuestionCollection[];
}

export function inquireCustomJourneyTime(): any {
  return [
    {
      message: "Especifique sua jornada de trabalho no formato HH:MM :",
      name: "customJourneytime",
      type: "input",
    },
  ] as QuestionCollection[];
}

export function meliFluxThirdStep(secondStepInquirer: any): QuestionCollection[] {
  if (secondStepInquirer.isDefaultMeliWorktime === false) {
    return inquireCustomJourneyTime();
  }

  return [] as QuestionCollection[];
}

export function otherCompaniesFluxThirdStep(secondStepInquirer: any): QuestionCollection[] {
  let inquiries = [] as QuestionCollection[];

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
    companyId: secondStepInquirer.whichMeli,
    date: moment().format("YYYY-MM-DD"),
    debug: false,
    journeyTime: secondStepInquirer.isDefaultMeliWorktime ? "08:48" : thirdStepInquirer.customJourneytime,
    momentDate: moment(),
    password: secondStepInquirer.ahgoraPassword,
    systemId: WorktimeProviderName.AHGORA.toLowerCase(),
    userId: secondStepInquirer.ahgoraUsername,
  };
}

export function otherCompaniesGenerateOptions(secondStepInquirer: any, thirdStepInquirer: any): WorktimeProviderOptions {
  if (secondStepInquirer.provider === AHGORA) {
    return {
      companyId: secondStepInquirer.ahgoraCompanyId,
      date: moment().format("YYYY-MM-DD"),
      debug: false,
      journeyTime: secondStepInquirer.journeytime === OTHER ? thirdStepInquirer.customJourneytime : secondStepInquirer.journeytime,
      momentDate: moment(),
      password: thirdStepInquirer.ahgoraPassword,
      systemId: "ahgora",
      userId: thirdStepInquirer.ahgoraUsername,
    };
  }

  throw new CLIError("Somente o Ahgora é suportado no momento!");

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function meliFluxGetPassword(secondStepInquirer: any, thirdStepInquirer: any): string {
  return secondStepInquirer.ahgoraPassword
}

export function otherCompaniesGetPassword(secondStepInquirer: any, thirdStepInquirer: any): string {
  return thirdStepInquirer.ahgoraPassword
}
