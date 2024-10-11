
<p align="center">
  <br />

  <picture>
    <img alt="XState logotype" src="/logo-dark.png">
  </picture>
  <br />
    <strong>Actor-based state-management as components.</strong> <a href="https://stately.ai/docs">→ Documentation</a>
  <br />
  <br />
</p>


[![CI](https://github.com/NullVoxPopuli/ember-statechart-component/actions/workflows/ci.yml/badge.svg)](https://github.com/NullVoxPopuli/ember-statechart-component/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/ember-statechart-component.svg)](https://www.npmjs.com/package/ember-statechart-component)


Support
------------------------------------------------------------------------------

- XState >= 5
- TypeScript >= 5
- ember-source >= 5.1
- Glint >= 1.2.1

Installation
------------------------------------------------------------------------------

```bash
npm install ember-statechart-component
```

Anywhere in your app, add a one time setup function:

```ts
import { setupComponentMachines } from 'ember-statechart-component';

setupComponentMachines();
```

## Migrating from XState v4?

See: https://stately.ai/docs/migration


Usage
------------------------------------------------------------------------------

```gjs
import { createMachine } from 'xstate';

const Toggler = createMachine({
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } },
  },
});

<template>
  <Toggler as |snapshot send|>
    {{snapshot.value}}

    <button {{on 'click' (fn send 'TOGGLE')}}>
      Toggle
    </button>
  </Toggler>
</template>
```

### Accessing EmberJS Services

```gjs
import { getService } from 'ember-statechart-component';
import { setup } from 'xstate';

const AuthenticatedToggle = setup({
  actions: {
    notify: ({ context }) => {
      getService(context, 'toasts').notify('You must be logged in');
    },
  },
  guards: {
    isAuthenticated: ({ context }) => getService(context, 'session').isAuthenticated,
  },
}).createMachine({
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        TOGGLE: [
          {
            target: 'active',
            cond: 'isAuthenticated',
          },
          { actions: ['notify'] },
        ],
      },
    },
    active: { on: { TOGGLE: 'inactive' } },
  },
});

<template>
  <AuthenticatedToggle as |snapshot send|>
    {{snapshot.value}}

    <button {{on 'click' (fn send 'TOGGLE')}}>
      Toggle
    </button>
  </AuthenticatedToggle>
</template>
```


### Matching States

```hbs
<Toggle as |state send|>
  {{#if (state.matches 'inactive')}}
    The inactive state
  {{else if (state.matches 'active')}}
    The active state
  {{else}}
    Unknown state
  {{/if}}

  <button {{on 'click' (fn send 'TOGGLE')}}>
    Toggle
  </button>
</Toggle>
```

### API


#### `@config`

This argument allows you to pass a [MachineOptions](https://xstate.js.org/docs/packages/xstate-fsm/#api) for [actions](https://xstate.js.org/docs/guides/actions.html), [services](https://xstate.js.org/docs/guides/communication.html#configuring-services), [guards](https://xstate.js.org/docs/guides/guards.html#serializing-guards), etc.

Usage:

<details><summary>Toggle machine that needs a config</summary>

```js
// app/components/toggle.js
import { createMachine, assign } from 'xstate';

export default createMachine({
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: {
      on: {
        TOGGLE: {
          target: 'inactive',
          actions: ['toggleIsOn']
        }
      }
    },
  },
});
```

</details>

```hbs
<Toggle
  @config={{hash
    actions=(hash
      toggleIsOn=@onRoomIlluminated
    )
  }}
as |state send|>
  <button {{on 'click' (fn send 'TOGGLE')}}>
    Toggle
  </button>
</Toggle>
```

#### `@input`

TODO: write this

#### `@context`

Sets the initial context. The current value of the context can then be accessed via `state.context`.

Usage:

<details><summary>Toggle machine that interacts with context</summary>

```js
// app/components/toggle.js
import { createMachine, assign } from 'xstate';

export default createMachine({
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        TOGGLE: {
          target: 'active',
          actions: ['increaseCounter']
        }
      }
    },
    active: {
      on: {
        TOGGLE: {
          target: 'inactive',
          actions: ['increaseCounter']
        }
      }
    },
  },
}, {
  actions: {
    increaseCounter: assign({
      counter: (context) => context.counter + 1
    })
  }
});
```

</details>

```hbs
<Toggle @context=(hash counter=0) as |state send|>
  <button {{on 'click' (fn send 'TOGGLE')}}>
    Toggle
  </button>

  <p>
    Toggled: {{state.context.counter}} times.
  </p>
</Toggle>
```

#### `@snapshot`

The machine will use `@snapshot` as the initial state.
Any changes to this argument
are not automatically propagated to the machine.
An `ARGS_UPDATE` event (see details below) is sent instead.

### What happens if any of the passed args change?

An event will be sent to the machine for you, `ARGS_UPDATE`, along
with all named arguments used to invoke the component.



Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
