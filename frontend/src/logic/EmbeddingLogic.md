# Embeddings Logic

## User Prompts

User prompts will undergo a series of replacements and injections.  These include:

- Key replacement with value
- File injection
- to do: included/imported code files
- to do: embedding explanations

### Key Value Pairs

There is a value dictionary mapping keys to values:

```
const values: Dictionary<string> = {}
values["INPUT"] = input text box on UI; file name to start the chain prompts
values["SAVE_PROMPT"] = directions on how to format code for "Save" assistant prompts
```

To insert a key's value into a user prompt put percents (%) around it:

`%INPUT%`

### Inserting Files

Adding the following to a user prompt:

`<!! FILE KEY_NAME_FOR_VALUE ~/ts-react-express-openai-aici/backend/src/data/UserEntity.ts NOFILENAME !!/>`

will inject the file contents into the prompt:

```
// file contents
```

The `KEY_NAME_FOR_VALUE` will update the values map as follows:

```
values["KEY_NAME_FOR_VALUE"] = actual file name
```

Use the `KEY_NAME_FOR_VALUE` when referencing files.

Adding the following to a user prompt:

`<!! FILE KEY_NAME_FOR_VALUE ~/ts-react-express-openai-aici/backend/src/data/UserEntity.ts !!/>`

will inject the file contents into the prompt:

File name `folder/file.ext`:

```
// file contents
```

The files injected are from the last upload.
If the file doesn't exists, then an embedding search will be completed on file names.
Responses below a cosine similarity (0.75) will throw and error it's not confidently found.
When an embedding file is used, the file name will reflect the file it selected based on cosine similarities.

## Assistant Prompts

### Save

We have a dictionary of file name mapped to contents:

`fileNameToContents: Dictionary<string> = {}`

When we encounter the following in the assistant prompt:

`Save: VALUES_KEY_NAME`

We parse the chat assistant response returned for the following:

File name `folder/file.ext`:

```
// file contents
```

The following data points will be updated:

```
nameToContents[fileName] = fileContents
values["VALUES_KEY_NAME"] = fileName
```

Since the prompt history will be sent each user message, the content will contain the file contents.  You can reference the file by name.

## Equals

When we run into the following:

`Equals: value to check`

The chat assistant response will be compared to "value to check" for equality.
This is a sanity check - if failed and exception is thrown.

## Set

`Set: VALUES_KEY_NAME`

This will set key value pairs in the values dictionary:

```
values["VALUES_KEY_NAME"] = chat assistant response
```

## Usage

`EmbeddingLogic` instance will be used to iterate over each message.
The process function will handle one user-assistant message pairs at a time.
This provides an opertunity to update and provide responses between messages prompts.
The following is an example of hot to use:

```
const embeddingLogic = new EmbeddingLogic(this.state.messages, this.state.input);
try {
    while (embeddingLogic.completed.length < embeddingLogic.originals.length) {
        await embeddingLogic.process();
        await this.updateState({ 
            output: embeddingLogic.markdownCompletions(),
            files: embeddingLogic.markdownSaves()
        });
    }
}
catch (err) {
    await this.updateState({ 
        output: embeddingLogic.markdownCompletions(),
        files: embeddingLogic.markdownSaves()
    });
    await ErrorMessage(this, err);
}
```
