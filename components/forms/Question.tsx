"use client";
import React, { useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionsSchema } from "@/lib/validations";
import { Editor } from "@tinymce/tinymce-react";
import { Badge } from "../ui/badge";
import Image from "next/image";

const QuestionForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: "",
      explanation: "",
      tags: [],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values, "values");
  }
  // Question editor initialisation
  const editorRef = useRef(null);

  // Tag handling function

  const addTagHandler = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim(); // getting the value

      if (tagValue !== "") {
        // checking if the field is not empty
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "tags",
            message: "Tag must be less than 15 characters", // error is value is greater than 15 characters
          });
        }
        if (!field.value.includes(tagValue)) {
          // checking for duplicate value
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
          console.log([...field.value, tagValue], "tag value");
        } else {
          return form.setError("tags", {
            type: "tags",
            message: "Tag already exists", // value already exists
          });
        }
      } else {
        form.trigger();
      }
    }
  };
  const tagRemoveHandler = (tag: string, field: any) => {
    const currentTags = Array.isArray(field.value) ? field.value : [];
    const newTags = currentTags.filter((t: string) => t !== tag);

    form.setValue("tags", newTags);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark200_light900">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus text-dark400_light800 paragraph-regular background-light800_dark300 mb-2 mt-3 w-full py-6 dark:border-none"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular text-light400_light500 mb-2">
                Be specific and imagine you’re asking a question to another
                person
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        {/* Question Description with text editor */}
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark200_light900">
                Detailed explanation of your problem?{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_EDITOR_API_KEY}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => {
                    field.onChange(content);
                  }}
                  // @ts-ignore
                  onInit={(_evt, editor) => (editorRef.current = editor)}
                  initialValue=""
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "codesample",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo " +
                      "bold italic forecolor codesample | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist ",
                    content_style: "body { font-family:Inter; font-size:14px }",
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular text-light400_light500 mb-2">
                Be specific and imagine you’re asking a question to another
                person
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark200_light900">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <>
                  <Input
                    className="no-focus text-dark400_light800 paragraph-regular background-light800_dark300 mb-2 mt-3 w-full py-6 dark:border-none"
                    placeholder="...Add Tags"
                    onKeyDown={(e) => addTagHandler(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="mb-2 mt-2.5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 mr-2.5 cursor-pointer rounded-md p-1.5 capitalize "
                          onClick={() => tagRemoveHandler(tag, field)}
                        >
                          {tag}{" "}
                          <Image
                            src="/assets/icons/close.svg"
                            alt="close"
                            width={12}
                            height={12}
                            className="ml-1 invert-0 dark:invert"
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular text-light400_light500 mb-2">
                Add up to 5 tags to describe what your question is about. Start
                typing to see suggestions.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default QuestionForm;
