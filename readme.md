# Neverfail

> Create robust code that forces you to handle failure states by modelling Option, Result, and Task types.

## Getting started

@TODO

## Aims

> To make code more robust by enforcing failure state handling

There are a couple of principles that this code follows in order to achieve the goal:

- Prefer usability over functional programming purity
- Interop with [ts-match](https://github.com/gvergnaud/ts-pattern) for pattern matching access
- Follow conventions from [fp-ts](https://github.com/gcanti/fp-ts) to allow smoother transition to that library
- Errors, nulls, and undefineds are considered failure states

`neverfail` functions and structures are _like_ common functional programming paradigms but will prefer usability over convention i.e. their implementation might not follow your favourite FP implementation of a similarly named thing.

If functional programming purity is more suited to your requirements then we strongly recommend using [fp-ts](https://github.com/gcanti/fp-ts). Fp-ts is super but very pure, if you want to dip your toe into the water without fully understanding all FP techniques and paradigms then starting with `neverfail` is a good idea. `neverfail` aims to smooth the transition from imperative code to an FP style while focussing on the tangible issue of handling failure states.

`neverfail` uses the following naming conventions:

- `Option<A> = None | Some<A>`
- `Result<E, A> = Err<E> | Ok<A>`
- `Either<E, A> = Err<E> | None | Some<A> | Ok<A>`
- `Task<A, E> = Err<E> | None | Some<A> | Ok<A>`

`Option` is similar to `Option` or `Maybe` types, `Result` is similar to `Result` or `Either` types, and `Either` is a composition of both `Option` and `Result` and `Task` is an asynchronous version of `Either`.

We prefer usability over purity hence `Either` being a union of `Option` and `Result` types rather than a discrete type modelling left and right.

Each type class exposes methods to provide 2 things:

- Wrap functions to capture errors and null/undefined states
- Provide methods for composing functions safely

In addition there are interop functions for type conversion between type classes. `Option` handles null/undefined values, while `Result` handles errors. `Either | Task` handles all of these primitives.

Note that anything is throwable in Javascript, Typescript models this, and `neverfail` also models this by defaulting `Err<E>` to wrap an `unknown` type.

## API
