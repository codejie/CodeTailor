# Tailor
## Core
- Index
- Template
- Project

## Run
>Run under command line.

## Index
- Block

    >@#index{params}#@

```js
export interface Block {
    name: string,
    base?: string,
    loop?: number
}
```

- Symbol

    >@@index{params}@@

```js
export interface Symbol {
    name: string,
    base?: string,
    isTemplate?: boolean,
    template?: string,
    size?: number,
    delimiter?: string,
    output?: (indexConfig?: IndexConfig, nested?: Nested[], position?: number) => string,
    desc?: string,
    example?: string
}
```

## Template

```js
export interface Template {
    name: string,
    file: string,
    desc?: string,
    author?: string,
    version?: string,
    indexConfig?: string,
    jsIndex?: string,
    jsonIndex?: string,
    output?: string,
    lines: string[],
}
```

## Project (TBD)

```js
export interface Project { // project.config
    name: string,
    desc?: string,
    author?: string,
    version?: string,
    indexConfig?: string, // default ./index
    included?: string[],
    excluded?: string[],
    output?: string, // default ./output
}
```
 
## Example

|Index|
|:--:|
|a|