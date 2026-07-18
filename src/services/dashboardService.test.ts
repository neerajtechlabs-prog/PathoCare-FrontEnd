import test from 'node:test';
import assert from 'node:assert/strict';
import { mapDashboardSummaryToUiModel } from './dashboardService';

test('maps summary response into dashboard UI state', () => {
  const result = mapDashboardSummaryToUiModel({
    stats: {
      totalPatients: { value: 12, trend: '+10.0%' },
      pendingResults: { value: 3, trend: '+5.0%' },
      dueReceipts: { value: 4, trend: '-1.0%' },
      outstandingTests: { value: 6, trend: '+20.0%' },
    },
    workload: [{ department: 'Hematology', progress: 75 }],
    today: { bookings: 28, reportsPending: 6, receiptsDue: 4 },
    recentActivity: [{ title: 'New booking created', detail: 'Patient: Rajesh Kumar' }],
  });

  assert.equal(result.stats[0].value, 12);
  assert.equal(result.stats[1].label, 'Pending Results');
  assert.equal(result.workload[0].label, 'Hematology');
  assert.equal(result.today.bookings, 28);
  assert.equal(result.activity[0].title, 'New booking created');
});
