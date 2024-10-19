/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Public API is defined by this file.
 * If you use any API outside of what is defined here,
 * it's possible it won't be supported.
 */

import type { Registry } from '@ember/service';

export function getService<Key extends keyof Registry>(
  context: unknown,
  serviceName: Key
): Registry[Key];

import type { ComponentLike } from '@glint/template';
import type { AnyActorLogic, EventFromLogic } from 'xstate';
import type {
  Actor,
  ActorLogic,
  ActorSystem,
  AnyActorRef,
  EventObject,
  MachineContext,
  MachineSnapshot,
  MetaObject,
  ParameterizedObject,
  ProvidedActor,
  // StateMachine must be imported
  // in order for the interface to merge
  StateMachine,
  StateSchema,
  StateValue,
  // StateValueMap must be imported
  // in order for the interface to merge
  StateValueMap,
} from 'xstate';

declare module 'xstate' {
  /**
   * NOTE: before you think about making StateValue renderable,
   *       remember that it can be an object (for nested states)
   */
  function send(eventType: string): void;
  function send(event: EventFromLogic<AnyActorLogic>): void;

  // Mixing in ComponentLike to the StateMachine type
  interface StateMachine<
    TContext extends MachineContext,
    TEvent extends EventObject,
    TChildren extends Record<string, AnyActorRef | undefined>,
    TActor extends ProvidedActor,
    TAction extends ParameterizedObject,
    TGuard extends ParameterizedObject,
    TDelay extends string,
    TStateValue extends StateValue,
    TTag extends string,
    TInput,
    TOutput,
    TEmitted extends EventObject,
    TMeta extends MetaObject,
    TConfig extends StateSchema,
  > extends ComponentLike<{
        Args: {
          config?: TConfig;
          context?: TContext;
          input?: TInput;
          snapshot?: TStateValue;
        };
        Blocks: {
          default: [
            machine: {
              /**
               * Pass a function to this to be called when the machine transitions state
               */
              onTransition: (...params: Parameters<Actor<AnyActor>['subscribe']>) => void;
              /**
               * The current snapshot's value.
               * Will be a string, or object, depending on state complexity.
               */
              value: StateValue;
              /**
               * The snapshot value (state), as a dot-separated string
               */
              statePath: string;
              /**
               * Send an event to the machine.
               * For simple events, passing only a string is allowed as an alias
               * for { type: "EVENT_NAME" }
               */
              send: typeof send;

              /**
               * The Machine's Snapshot
               */
              snapshot: SnapshotFrom<
                StateMachine<
                  TContext,
                  TEvent,
                  TChildren,
                  TActor,
                  TAction,
                  TGuard,
                  TDelay,
                  TStateValue,
                  TTag,
                  TInput,
                  TOutput,
                  TEmitted,
                  TMeta,
                  TConfig
                >
              >;
              /**
               * If specific behavior is needed, or for more type-accurate
               * usage in templates, the full actor is exposed here.
               */
              actor: Actor<
                StateMachine<
                  TContext,
                  TEvent,
                  TChildren,
                  TActor,
                  TAction,
                  TGuard,
                  TDelay,
                  TStateValue,
                  TTag,
                  TInput,
                  TOutput,
                  TEmitted,
                  TMeta,
                  TConfig
                >
              >;
            },
          ];
        };
      }>,
      ActorLogic<
        MachineSnapshot<TContext, TEvent, TChildren, TStateValue, TTag, TOutput, TMeta, TConfig>,
        TEvent,
        TInput,
        ActorSystem<any>,
        TEmitted
      > {
    // Indicator that we've messed with the types comeing from xstate.
    // (Also useful for debugging)
    __has_been_declaration_merged_from_ember_statechart_component__: string;
  }
}
