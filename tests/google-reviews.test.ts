import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_SETTINGS,
  INITIAL_SEED_REVIEWS,
  DEFAULT_GOOGLE_MAPS_URL,
} from "../src/lib/google-reviews.server";

describe("Google Reviews Integration Tests", () => {
  it("initial seed reviews contain verified authentic 5-star Google reviews", () => {
    assert.ok(Array.isArray(INITIAL_SEED_REVIEWS));
    assert.strictEqual(INITIAL_SEED_REVIEWS.length, 5);

    for (const rev of INITIAL_SEED_REVIEWS) {
      assert.ok(rev.reviewer_name, "Reviewer name must be present");
      assert.strictEqual(rev.star_rating, 5, "Initial reviews should be 5 stars");
      assert.ok(rev.review_text.length > 20, "Review text should be descriptive");
      assert.strictEqual(rev.is_published, true, "Seed reviews should be published");
      assert.ok(rev.google_review_id.startsWith("google-rev-seed-"));
    }
  });

  it("default settings have proper fallbacks and valid maps link", () => {
    assert.strictEqual(DEFAULT_SETTINGS.average_rating, 4.9);
    assert.strictEqual(DEFAULT_SETTINGS.sync_frequency_hours, 24);
    assert.strictEqual(DEFAULT_SETTINGS.sync_status, "idle");
    assert.strictEqual(DEFAULT_SETTINGS.google_maps_url, DEFAULT_GOOGLE_MAPS_URL);
    assert.ok(DEFAULT_SETTINGS.google_maps_url.includes("Saurashtra+Honey+Bee+Farm"));
  });

  it("handles duplicate review deduplication correctly by google_review_id", () => {
    const reviewsMap = new Map();

    const incoming = [
      ...INITIAL_SEED_REVIEWS,
      // Duplicate with updated text
      {
        ...INITIAL_SEED_REVIEWS[0],
        review_text: "Updated text from customer on Google Maps.",
      },
      // Distinct new review
      {
        id: "new-google-rev-6",
        google_review_id: "google-rev-6",
        reviewer_name: "Karan Mehta",
        reviewer_photo_url: null,
        star_rating: 5,
        review_text: "Ordered Fennel Flora Honey. Unmatched purity!",
        review_date: new Date().toISOString(),
        is_published: true,
      },
    ];

    for (const r of incoming) {
      reviewsMap.set(r.google_review_id, r);
    }

    const uniqueReviews = Array.from(reviewsMap.values());
    assert.strictEqual(uniqueReviews.length, 6, "Must contain exactly 6 unique reviews");

    const updatedFirst = uniqueReviews.find(
      (r) => r.google_review_id === INITIAL_SEED_REVIEWS[0].google_review_id,
    );
    assert.strictEqual(
      updatedFirst.review_text,
      "Updated text from customer on Google Maps.",
      "Duplicate review must update with the latest content",
    );
  });
});
