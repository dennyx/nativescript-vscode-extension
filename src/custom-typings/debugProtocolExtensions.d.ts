import {DebugProtocol} from 'vscode-debugprotocol';

declare module 'vscode-debugprotocol' {
    namespace DebugProtocol {

        type RequestArguments = LaunchRequestArguments | AttachRequestArguments;
        type RequestType = "launch" | "attach";
        type PlatformType = "android" | "ios";

        interface IRequestArgs {
            request: RequestType;
            platform: PlatformType;
            appRoot: string;
            sourceMaps?: boolean;
            diagnosticLogging?: boolean;
            tnsArgs?: string[];
            tnsOutput?: string;
        }

        interface ILaunchRequestArgs extends DebugProtocol.LaunchRequestArguments, IRequestArgs {
            stopOnEntry?: boolean;
            rebuild?: boolean;
            syncAllFiles?: boolean;
        }

        interface IAttachRequestArgs extends DebugProtocol.AttachRequestArguments, IRequestArgs {
        }

        interface ISetBreakpointsArgs extends DebugProtocol.SetBreakpointsArguments {
            /** DebugProtocol does not send cols, maybe it will someday, but this is used internally when a location is sourcemapped */
            cols?: number[];
            authoredPath?: string;
        }

        interface IBreakpoint extends DebugProtocol.Breakpoint {
            column?: number;
        }

        /*
        * The ResponseBody interfaces are copied from debugProtocol.d.ts which defines these inline in the Response interfaces.
        * They should always match those interfaces, see the original for comments.
        */
        interface ISetBreakpointsResponseBody {
            breakpoints: IBreakpoint[];
        }

        interface ISourceResponseBody {
            content: string;
        }

        interface IThreadsResponseBody {
            threads: DebugProtocol.Thread[];
        }

        interface IStackTraceResponseBody {
            stackFrames: DebugProtocol.StackFrame[];
            totalFrames?: number;
        }

        interface IScopesResponseBody {
            scopes: DebugProtocol.Scope[];
        }

        interface IVariablesResponseBody {
            variables: DebugProtocol.Variable[];
        }

        interface IEvaluateResponseBody {
            result: string;
            variablesReference: number;
        }

        type PromiseOrNot<T> = T | Promise<T>;

        interface IDebugAdapter {
            registerEventHandler(eventHandler: (event: DebugProtocol.Event) => void): void;

            initialize(args: DebugProtocol.InitializeRequestArguments): PromiseOrNot<DebugProtocol.Capabilities>;
            launch(args: ILaunchRequestArgs): PromiseOrNot<void>;
            configurationDone(args: DebugProtocol.ConfigurationDoneArguments): void;
            disconnect(): PromiseOrNot<void>;
            attach(args: IAttachRequestArgs): PromiseOrNot<void>;
            setBreakpoints(args: DebugProtocol.SetBreakpointsArguments): PromiseOrNot<ISetBreakpointsResponseBody>;
            setExceptionBreakpoints(args: DebugProtocol.SetExceptionBreakpointsArguments): PromiseOrNot<void>;

            continue(): PromiseOrNot<void>;
            next(): PromiseOrNot<void>;
            stepIn(): PromiseOrNot<void>;
            stepOut(): PromiseOrNot<void>;
            pause(): PromiseOrNot<void>;

            stackTrace(args: DebugProtocol.StackTraceArguments): PromiseOrNot<IStackTraceResponseBody>;
            scopes(args: DebugProtocol.ScopesArguments): PromiseOrNot<IScopesResponseBody>;
            variables(args: DebugProtocol.VariablesArguments): PromiseOrNot<IVariablesResponseBody>;
            source(args: DebugProtocol.SourceArguments): PromiseOrNot<ISourceResponseBody>;
            threads(): PromiseOrNot<IThreadsResponseBody>;
            evaluate(args: DebugProtocol.EvaluateArguments): PromiseOrNot<IEvaluateResponseBody>;
        }

        interface IDebugTransformer {
            initialize?(args: DebugProtocol.InitializeRequestArguments, requestSeq?: number): PromiseOrNot<void>;
            launch?(args: ILaunchRequestArgs, requestSeq?: number): PromiseOrNot<void>;
            attach?(args: IAttachRequestArgs, requestSeq?: number): PromiseOrNot<void>;
            setBreakpoints?(args: DebugProtocol.SetBreakpointsArguments, requestSeq?: number): PromiseOrNot<void>;
            setExceptionBreakpoints?(args: DebugProtocol.SetExceptionBreakpointsArguments, requestSeq?: number): PromiseOrNot<void>;

            stackTrace?(args: DebugProtocol.StackTraceArguments, requestSeq?: number): PromiseOrNot<void>;
            scopes?(args: DebugProtocol.ScopesArguments, requestSeq?: number): PromiseOrNot<void>;
            variables?(args: DebugProtocol.VariablesArguments, requestSeq?: number): PromiseOrNot<void>;
            source?(args: DebugProtocol.SourceArguments, requestSeq?: number): PromiseOrNot<void>;
            evaluate?(args: DebugProtocol.EvaluateArguments, requestSeq?: number): PromiseOrNot<void>;

            setBreakpointsResponse?(response: ISetBreakpointsResponseBody, requestSeq?: number): PromiseOrNot<void>;
            stackTraceResponse?(response: IStackTraceResponseBody, requestSeq?: number): PromiseOrNot<void>;
            scopesResponse?(response: IScopesResponseBody, requestSeq?: number): PromiseOrNot<void>;
            variablesResponse?(response: IVariablesResponseBody, requestSeq?: number): PromiseOrNot<void>;
            sourceResponse?(response: ISourceResponseBody, requestSeq?: number): PromiseOrNot<void>;
            threadsResponse?(response: IThreadsResponseBody, requestSeq?: number): PromiseOrNot<void>;
            evaluateResponse?(response: IEvaluateResponseBody, requestSeq?: number): PromiseOrNot<void>;

            scriptParsed?(event: DebugProtocol.Event);
        }
    }
}