import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import ReactCanvasConfetti from "react-canvas-confetti";

type InitType = NonNullable<
  Parameters<typeof ReactCanvasConfetti>[0]["onInit"]
>;
type ConfettiInstance = Parameters<InitType>[0]["confetti"];

function Confetti() {
  const confettiRef = useRef<ConfettiInstance>(null);
  const onInit: InitType = useCallback(({ confetti }) => {
    confettiRef.current = confetti;
  }, []);

  const fireConfetti = useCallback(() => {
    if (confettiRef.current) {
      confettiRef.current({
        particleCount: 100,
        spread: 70,
        origin: {
          x: 0.35,
          y: 0.7,
        },
      });

      confettiRef.current({
        particleCount: 100,
        spread: 70,
        origin: {
          x: 0.65,
          y: 0.7,
        },
      });
    }
  }, []);

  useEffect(() => {
    confettiRef.current && fireConfetti();
  }, [confettiRef.current]);

  return <ReactCanvasConfetti onInit={onInit} />;
}

export function Modal({
  children,
  show,
  title,
  handleClose,
  withConfetti = false,
}: PropsWithChildren<{
  show: boolean;
  title?: string;
  handleClose: () => void;
  withConfetti?: boolean;
}>) {
  return (
    <Dialog
      as="div"
      open={show}
      onClose={handleClose}
      className={`absolute left-0 top-0 flex h-screen w-screen items-center justify-center bg-gray-500 bg-opacity-50`}
    >
      <DialogPanel className="flex w-96 flex-col gap-6 rounded-2xl bg-gray-50 py-4 text-center shadow-lg">
        {title && (
          <div className="w-full">
            <DialogTitle as="h2" className="text-2xl text-blue-900">
              {title}
            </DialogTitle>
          </div>
        )}
        {children}
      </DialogPanel>
      {withConfetti && show && <Confetti />}
    </Dialog>
  );
}
