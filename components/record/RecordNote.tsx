"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function RecordNote() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  return (
    <div className="min-h-84">
      <div className="bg-gray-100 rounded-lg p-5">
        <header className="flex justify-between items-center">
          <h3 className="typo-h2-xl text-gray-900">Note</h3>

          <Button
            type="button"
            variant="ghost"
            className="p-0 size-6"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              <ChevronDown className="size-6 text-gray-400" />
            </motion.span>
          </Button>
        </header>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="note-panel"
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <textarea
                value={note}
                onChange={(e) => {
                  if (e.target.value.length <= 1500) {
                    setNote(e.target.value);
                  }
                }}
                placeholder="말할내용을 미리 정리해보세요"
                className="w-full h-55 resize-none typo-body1-base outline-none"
                maxLength={1500}
              />
              <div className="mt-2 text-right text-xs text-gray-400">
                <span
                  className={note.length === 1500 ? "text-primary-700" : ""}
                >
                  {note.length}
                </span>
                /1500
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
