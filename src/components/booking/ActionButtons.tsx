import React from 'react';
import {
  Save,
  Trash2,
  Printer,
  Search,
  RotateCcw,
  LogOut,
  X,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface ActionButtonsProps {
  onSave: () => void;
  onDelete?: () => void;
  onPrint?: () => void;
  onSearch?: () => void;
  onRefresh: () => void;
  onExit: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onDelete,
  onPrint,
  onSearch,
  onRefresh,
  onExit,
  isLoading = false,
  isEditing = false,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="submit"
        onClick={onSave}
        disabled={isLoading}
        className="gap-2"
      >
        <Save size={18} />
        {isEditing ? 'Update' : 'Save'} Booking
      </Button>

      {isEditing && onDelete && (
        <Button
          type="button"
          onClick={onDelete}
          disabled={isLoading}
          variant="danger"
          className="gap-2"
        >
          <Trash2 size={18} />
          Delete
        </Button>
      )}

      {onPrint && (
        <Button
          type="button"
          onClick={onPrint}
          variant="outline"
          disabled={isLoading}
          className="gap-2"
        >
          <Printer size={18} />
          Print
        </Button>
      )}

      {onSearch && (
        <Button
          type="button"
          onClick={onSearch}
          variant="outline"
          disabled={isLoading}
          className="gap-2"
        >
          <Search size={18} />
          Search
        </Button>
      )}

      <Button
        type="button"
        onClick={onRefresh}
        variant="outline"
        disabled={isLoading}
        className="gap-2"
      >
        <RotateCcw size={18} />
        Reset
      </Button>

      <Button
        type="button"
        onClick={onExit}
        variant="outline"
        className="gap-2 ml-auto"
      >
        <LogOut size={18} />
        Exit
      </Button>
    </div>
  );
};
