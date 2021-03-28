# CodeTailor
a tool for generating code base on the template.

## Example
- The template file of CodeTailor
```
@!name test
@!version v0.1
@!author Jie.
@!jsonIndex ./test.json
@!jsIndex ./test
@!template
This is a normal line.

@#case{"loop":1}#@
    `@`#case`@`# is the block indicator;
@#case#@

@#case#@
    `@`@symbol`@`@ is the symbol indicator;
    '@@symbol@@' is a simple string or complex object;
    @@example{"value":"for example"}@@:
    multi output: @@multi@@
    complex output: @@complex{"size": 2}@@.
    recursion output: @@recursion@@
@#case#@

```
- The output of the above template
```
This is a normal line.

    @#case@# is the block indicator;

    symbol indicator is the symbol indicator;
    'symbol indicator' is a simple string or complex object;
    for example:
    multi output: abc|abc
    complex output: 
        line in block 'case' at 0 loop
        line in block 'case' at 1 loop.
    nested output: symbol indicator with abc|abc|abc.
    recursion output: ********
```