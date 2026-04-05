package Nhom21.weboto.service;

import Nhom21.weboto.dto.ReviewDTO;
import Nhom21.weboto.dto.ReviewRequest;
import Nhom21.weboto.entity.Part;
import Nhom21.weboto.entity.Review;
import Nhom21.weboto.entity.User;
import Nhom21.weboto.exception.ResourceNotFoundException;
import Nhom21.weboto.repository.PartRepository;
import Nhom21.weboto.repository.ReviewRepository;
import Nhom21.weboto.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PartRepository partRepository;
    
    @Autowired
    private OrderRepository orderRepository;

    public List<ReviewDTO> getReviewsByPartId(Integer partId) {
        return reviewRepository.findByPartIdOrderByCreatedAtDesc(partId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO addReview(User user, ReviewRequest request) {
        Part part = partRepository.findById(request.getPartId())
                .orElseThrow(() -> new ResourceNotFoundException("Part not found"));
                
        long boughtCount = orderRepository.countOrdersByUserAndPartAndStatus(user.getId(), part.getId());
        if (boughtCount == 0) {
            throw new IllegalArgumentException("Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua giao dịch thành công.");
        }

        Review review = new Review();
        review.setUser(user);
        review.setPart(part);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());
        
        Review saved = reviewRepository.save(review);
        return mapToDTO(saved);
    }

    private ReviewDTO mapToDTO(Review review) {
        return new ReviewDTO(
                review.getId(),
                review.getUser().getId(),
                review.getUser().getUsername(),
                review.getPart().getId(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
