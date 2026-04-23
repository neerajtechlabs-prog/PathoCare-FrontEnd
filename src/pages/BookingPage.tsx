import React from 'react';
import { useParams } from 'react-router-dom';
import BookingFormContainer from '../components/booking/BookingFormContainer';

export const BookingPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  // Determine the mode based on URL and params
  let mode: 'create' | 'edit' | 'view' = 'create';
  if (id) {
    mode = 'edit'; // You could add ?view=true to check for view mode
  }

  return (
    <BookingFormContainer
      bookingId={id}
      mode={mode}
    />
  );
};

export default BookingPage;
