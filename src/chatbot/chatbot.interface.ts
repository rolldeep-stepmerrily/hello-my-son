interface IUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface IMessage {
  content: string;
  role: string;
}

interface IChoices {
  index: number;
  finish_reason: string;
  message: IMessage[];
  delta: IMessage[];
}

export interface IAnswer {
  id: string;
  model: string;
  created: number;
  usage: IUsage;
  citations: string[];
  object: string;
  choices: IChoices[];
}
