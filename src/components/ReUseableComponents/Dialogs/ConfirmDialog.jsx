import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "@/components/Layout/TranslationContext";

/**
 * Reusable Confirmation Dialog Component
 * 
 * @param {Object} props
 * @param {boolean} props.open - Controls dialog visibility
 * @param {Function} props.onOpenChange - Handler for dialog open/close state changes
 * @param {Function} props.onConfirm - Handler when user confirms the action
 * @param {string} props.title - Dialog title (translation key or text)
 * @param {string} props.description - Dialog description/message (translation key or text)
 * @param {string} props.confirmText - Text for confirm button (translation key or text, defaults to "confirm")
 * @param {string} props.cancelText - Text for cancel button (translation key or text, defaults to "cancel")
 * @param {string} props.confirmButtonClass - Custom CSS classes for confirm button
 * @param {string} props.cancelButtonClass - Custom CSS classes for cancel button
 * @param {boolean} props.useTranslation - Whether to use translation for title/description (default: true)
 */
const ConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "confirm",
  cancelText = "cancel",
  confirmButtonClass = "bg-red-600 hover:bg-red-700 text-white",
  cancelButtonClass = "",
}) => {
  const t = useTranslation();

  // Handle confirm action
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  // Get translated or plain text
  const getText = (text) => {
    if (!text) return "";
    // If useTranslation is true, try to get translation
    // If translation exists and is different from the key, use translation
    // Otherwise use the text as-is (for plain text or missing translations)
    if (useTranslation) {
      const translated = t(text);
      // If translation returns something different from the key, use it
      // Otherwise, the key doesn't exist in translations, so use the text as-is
      return translated && translated !== text ? translated : text;
    }
    return text;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{getText(title)}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>
              {getText(description)}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => onOpenChange?.(false)}
            className={cancelButtonClass}
          >
            {getText(cancelText)}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={confirmButtonClass}
          >
            {getText(confirmText)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;

