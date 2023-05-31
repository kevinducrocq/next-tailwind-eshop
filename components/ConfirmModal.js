import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function ConfirmModal({
  handleConfirm,
  handleClose,
  isOpen,
  modalTitle,
  modalText,
  buttonConfirmText,
  buttonCancelText,
}) {
  const handleConfirmAndClose = () => {
    handleConfirm();
    handleClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-10 overflow-y-auto'
        onClose={handleClose}
      >
        <div className='min-h-screen px-4 text-center'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <span
            className='inline-block h-screen align-middle'
            aria-hidden='true'
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
              <Dialog.Title
                as='h2'
                className='text-xl font-medium leading-6 text-gray-900 flex justify-between mb-3'
              >
                {modalTitle}
              </Dialog.Title>
              <div className='my-2'>
                <p>{modalText}</p>
              </div>
              <div className='flex justify-end'>
                <button className='mr-2 default-button' onClick={handleClose}>
                  {buttonCancelText}
                </button>
                <button
                  className='primary-button'
                  onClick={handleConfirmAndClose}
                >
                  {buttonConfirmText}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
