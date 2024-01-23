import { Dialog, Transition } from "@headlessui/react";
import { LightningBoltIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useRef, useState } from "react";
import { expandConcept } from "../../utils/useAiAssistant";
import { convertMarkdownToPlainText } from "../../utils/useMarkdown";
import { SpinnerWithSpacing } from "../core/spinner.component";
import { notifyError } from "../core/toast.component";
import { PrimaryButton } from "../core/buttons.component";

export default function AiExpandConceptPromptDialogComponent({
  open,
  setOpen,
  content,
  insertContentCallback,
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (open && content) {
      setLoading(true);
      setResult(null);

      convertMarkdownToPlainText(content).then((text) => {
        expandConcept(text)
          .then((response) => {
            setResult(response);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            setOpen(false);
            notifyError("Failed to process request, please contact support.");
          });
      });
    }
  }, [open, content]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-20 backdrop-blur transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-50"
                    >
                      <LightningBoltIcon
                        className="h-6 w-6 text-indigo-600 inline-flex mr-2"
                        aria-hidden="true"
                      />

                      {loading ? "Loading..." : `Check out this draft`}
                    </Dialog.Title>

                    <div className="mt-5 w-full">
                      <div className="mt-1 space-y-1">
                        <dd className="mt-1 text-sm text-gray-900">
                          <div className="rounded-md border border-gray-200 dark:border-gray-600 dark:divide-gray-600 p-4">
                            {loading && <SpinnerWithSpacing />}

                            <p className="text-black dark:text-white whitespace-pre-wrap">
                              {result}
                            </p>
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Close
                </button>

                <PrimaryButton
                  disabled={loading || !result}
                  className="mr-1 disabled:cursor-not-allowed disabled:bg-gray-400"
                  label="Copy to post"
                  onClick={() => insertContentCallback(result)}
                />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
