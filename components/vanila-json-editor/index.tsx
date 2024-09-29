//
// JSONEditorReact.tsx
//
import { useEffect, useRef } from "react";
import { JSONEditor, JSONEditorPropsOptional } from "vanilla-jsoneditor";

interface JSONEditorReactProps extends JSONEditorPropsOptional {
  uploadHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearHandler?: () => void;
  generateSample?: () => void;
}
export const JSONEditorReact = (props: JSONEditorReactProps) => {
  const refContainer = useRef<HTMLDivElement>(null);
  const refEditor = useRef<JSONEditor | null>(null);

  useEffect(() => {
    // create editor
    refEditor.current = new JSONEditor({
      target: refContainer.current!,
      props: {},
    });

    return () => {
      // destroy editor
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // update props
    if (refEditor.current) {
      refEditor.current.updateProps(props);
    }
  }, [props]);

  return (
    <>
      <div className="flex justify-end gap-x-2 flex-wrap">
        {props.generateSample && (
          <Button
            variant={"cyan"}
            size={"sm"}
            onClick={props.generateSample}
            type="button"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Generate sample
          </Button>
        )}
        {props.clearHandler && (
          <Button
            variant={"edit"}
            size={"sm"}
            onClick={props.clearHandler}
            type="button"
          >
            <Eraser className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}

        {props.uploadHandler && (
          <Button variant={"success"} size={"sm"} type="button">
            <Label htmlFor="input-file" className="flex items-center gap-x-2">
              <Upload className="w-4 h-4" /> Upload Json file
            </Label>
            <Input
              id="input-file"
              type="file"
              className="hidden"
              onChange={props.uploadHandler}
              accept="application/JSON"
            />
          </Button>
        )}
      </div>
      <div ref={refContainer} />
    </>
  );
};

//
// TextContent.tsx
//
// (wrapper around toTextContent for use with NextJS)
//
import { Content, toTextContent } from "vanilla-jsoneditor";
import { Button } from "../ui/button";
import { Eraser, RefreshCcw, Upload } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface IOwnProps {
  content: Content;
}
export const TextContent = (props: IOwnProps) => {
  const { content } = props;

  return (
    <p>
      The contents of the editor, converted to a text string, are:{" "}
      {toTextContent(content).text}
    </p>
  );
};
