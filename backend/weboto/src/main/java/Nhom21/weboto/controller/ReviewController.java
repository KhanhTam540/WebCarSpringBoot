package Nhom21.weboto.controller;

import Nhom21.weboto.dto.ReviewDTO;
import Nhom21.weboto.dto.ReviewRequest;
import Nhom21.weboto.entity.User;
import Nhom21.weboto.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/part/{partId}")
    public ResponseEntity<List<ReviewDTO>> getPartReviews(@PathVariable Integer partId) {
        return ResponseEntity.ok(reviewService.getReviewsByPartId(partId));
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> addReview(
            @AuthenticationPrincipal User user,
            @RequestBody ReviewRequest request) {
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(reviewService.addReview(user, request));
    }
}
