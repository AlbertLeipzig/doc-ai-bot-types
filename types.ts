import { Schema } from "mongoose";

/* DATA STRUCTURE */

/* Vector Profile */

export type VectorProfileData = {
  _id: string;
  name?: string;
  model: string;
  chunkSize: number;
  chunkOverlap: number;
};

/* Conversation */

export type ConversationData = {
  _id: string;
  title: string;
  vectorProfileId: string;
  topK: number;
};

export type ConversationDataClient = ConversationData & {
  messages?: MessageData[];
};

export type MultipleConversationData = ConversationData[] | null;

/* Document */

export type VectorData = {
  content: string;
  embedding: number[];
  vectorProfileId: Schema.Types.ObjectId;
};

/* Message */

export type MessageData = {
  _id: Schema.Types.ObjectId;
  content: string;
  conversationId: String;
  metadata: {};
  role: "user" | "assistant" | "system";
  tokens?: number;
};

/* API INTERNAL LOGIC */

export type ApiConfig = {
  db: {
    uri: string;
  };
  llm: {
    chat: ChatConfig;
    docs: DocsConfig;
    embed: {
      batchSize: number;
      dimension: number;
      collectionName: string;
      maxConcurrency: number;
      maxRetries: number;
      timeoutMs: number;
      chunking: { size: number; overlap: number };
    };
    generate: GenerateConfig;
    ollamaBaseUrl: string;
    retrieve: {
      topK: number;
      indexName?: string;
      numCandidatesMultiplier: number;
      minNumCandidates: number;
    };
    vectorModel: string;
  };
  server: ServerConfig;
};

export type AskBody = {
  question: string;
  vectorProfileId: string;
  conversationId?: string;
  topK?: number;
};

export type Cors = {
  methods: string;
  origin: string;
};

export type DbConfig = {
  uri: string;
  vectorModel: string;
};

export type Endpoint = {
  path: string;
  method: Method;
};

export type Method = "GET" | "POST" | "PATCH" | "DELETE";

export type RequestData = Endpoint & {
  body?: unknown;
};

export type ServerConfig = {
  cookieOptions: {
    httpOnly: boolean;
    sameSite: string;
    secure: boolean;
    maxAge: number;
  };
  cors: Cors;
  mode: string;
  port: number;
  jwtSecret: string;
  adminUser: string;
  adminPassword: string;
};

/* LLM */

export type AskWithContextParams = {
  conversationId: string;
  content: string;
  topK?: number;
  model?: string;
  collection?: string;
  disableTitleGeneration?: boolean;
};

export type BenchmarkCentralConfig = {
  db: {
    uri: string;
  };
  llm: {
    chat: ChatConfig;
    docs: DocsConfig;
    embed: {
      batchSize: number;
      chunking: { sizes: number[]; overlaps: number[] };
      collectionName: string;
      dimension: number;
      maxConcurrency: number;
      maxRetries: number;
      timeoutMs: number;
    };
    generate: GenerateConfig;
    ollamaBaseUrl: string;
    retrieve: {
      indexName?: string;
      minNumCandidates: number;
      numCandidatesMultiplier: number;
      topKs: number[];
    };
    vectorModels: string[];
  };
  questions: string[];
  server: ServerConfig;
};

/* REMEMBER : numCandidatesMultiplier and minNumCandidates are related — one is derived from the other (candidates = Math.max(topK * multiplier, minNumCandidates)). */
/* numCandidatesMultiplier && minNumCandidates maps to Atlas Vector Store, but this is not the case with all db */

export type RetrieveConfig = {
  indexName?: string;
  minNumCandidates: number;
  numCandidatesMultiplier: number;
  topK: number;
};

export type ChatConfig = {
  maxContextChars: number;
  maxHistoryMessages: number;
};

export type ChunkingConfig = {
  overlap?: number;
  size?: number;
};

/* arguably to be in Benchmark instead */

export type ConstellationConfig = {
  docsConfig: DocsConfig;
  chunking: ChunkingConfig;
  model: string;
  collectionName: string;
};

export type IngestionResult = {
  totalChunks: number;
  errors: string[];
};

export type BenchmarkChunkingConfig = {
  overlaps: number[];
  sizes: number[];
};

export type BenchmarkRetrieveConfig = Omit<RetrieveConfig, "topK"> & {
  topKs: number[];
};

export type DocsConfig = {
  baseUrl: string;
  maxPages: number;
  requestDelayMs: number;
};

export type GenerateConfig = {
  maxRetries?: number;
  maxTokens: number;
  model: string;
  systemPrompt: string;
  temperature: number;
  timeoutMs?: number;
};

export type GenerationMessages =
  | Array<Pick<MessageData, "role" | "content">>
  | string;

export type GenerationOptions = Partial<GenerateConfig>;

export type LoadedDoc = {
  content: string;
  metadata?: Record<string, unknown>;
};

export type VectorUpdateData = {
  metadata?: unknown;
  content?: string;
  embedding?: unknown;
};

/* CLIENT Internal Logic */

export type BaseClientContext = {
  appState: ClientState;
  setAppState: Setter<ClientState>;
  lightMode: ClientMode;
  setLightMode: Setter<ClientMode>;
};

export type ClientAppContext = BaseClientContext & {
  activeConversation: ConversationDataClient | null;
  setActiveConversation: Setter<ConversationDataClient | null>;
  conversationsData: ConversationData[] | null;
  setConversationsData: Setter<ConversationData[] | null>;
};

export type ClientMode = "dark" | "light";

export type ClientState = {
  type: "loading" | "ready" | "error";
  content?: string;
};

export type ClientContextProps = {
  children: ReactNodeLike;
};

export type ConversationDataProps = {
  conversationData: ConversationData;
};

export type ConversationProps = {
  bottomAnchorRef?: RefObjectLike<HTMLDivElement | null>;
  form?: ReactNodeLike;
  loading?: ReactNodeLike;
};

export type MessageDataProps = {
  messageData: MessageData;
};

export type ReactNodeLike = any;

export type RefObjectLike<T> = {
  current: T;
};

export type Setter<T> = (value: T | ((prev: T) => T)) => void;

/* BENCHMARK */

export type BenchmarkIteration = {
  chunkOverlap: number;
  chunkSize: number;
  collectionName: string;
  documents: DocsConfig;
  questions: string[];
  threshold: number;
  topK: number;
  vectorModel: string;
};

export type StoredBenchmarkIteration = BenchmarkIteration & {
  _id: string;
};

export type BenchmarkSingleAnswer = {
  answer: string;
  benchmarkIterationId: string;
  latencyMs: number;
  question: string;
  scores: number[];
  vectorCount: number;
};

export type BenchmarkIterationResults = {
  results: BenchmarkSingleAnswer[];
};

export type EmbedConfig = {
  chunking: ChunkingConfig;
  collectionName?: string;
  docs: DocsConfig;
  embeddingDimension: number;
  indexName?: string;
  maxConcurrency: number;
  maxRetries: number;
  timeoutMs: number;
};

export type EmbeddedDoc = LoadedDoc & {
  embedding: number[];
};

export type EmbedOptions = {
  model?: string;
};

/* BENCHMARK CLIENT */

export type BenchmarkClientSetting = {
  model: string;
  chunkOverlap: number | null;
  chunkSize: number | null;
};

export type BenchmarkClientIterationResult = {
  vectorAmount: number;
  processingTime: number;
};

export type BenchmarkClientAppContext = BaseClientContext & {
  messages: MessageData[] | null;
  setMessages: Setter<MessageData | null>;
  conversations: ConversationData[] | null;
  setConversations: Setter<ConversationData[] | null>;
  profileVectors: VectorProfileData[] | null;
  setProfileData: Setter<VectorProfileData[] | null>;
  activeProfileVector: VectorProfileData | null;
  setActiveProfileVector: Setter<VectorProfileData | null>;

  /* benchmarkClientSettings: BenchmarkClientSetting;  */
  /* setBenchmarkClientSetting: Setter<BenchmarkClientSetting | null>;  */
  /* benchmarkClientIterationResult: BenchmarkClientIterationResult | null;  */
  /* setbenchmarkClientIterationResult: Setter<BenchmarkClientIterationResult>;  */
};

/* ERRORS & API-CLIENT COMMUNICATION */

/* 
- BaseError : what's an error?
- ApiResponse :type that defines what the API and Client use to communicate, including errors and other messages 
- ClientFormattedError : what the Client will use in order to manage internal logic and display info
- NormalizedClientRequest : what the Client will send to the API
*/

export type RawError = {
  code: number;
  message?: string;
};

export type ApiResponse = {
  code: 200 | 201 | 404 | 500;
  message?: string;
};

export type ClientFormattedError = {
  message: string;
};

export type NormalizedClientRequest = {
  message: string;
};
