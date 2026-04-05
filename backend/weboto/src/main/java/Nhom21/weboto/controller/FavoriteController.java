package Nhom21.weboto.controller;

import Nhom21.weboto.dto.FavoriteItemDto;
import Nhom21.weboto.entity.User;
import Nhom21.weboto.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/favorites")
public class FavoriteController {
    @Autowired
    private FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<FavoriteItemDto>> getFavorites(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(favoriteService.getFavorites(user));
    }

    @PostMapping("/{partId}")
    public ResponseEntity<FavoriteItemDto> addFavorite(
            @AuthenticationPrincipal User user,
            @PathVariable Integer partId
    ) {
        FavoriteItemDto favoriteItem = favoriteService.addFavorite(user, partId);

        if (favoriteItem == null) {
            favoriteItem = new FavoriteItemDto();
            favoriteItem.setPartId(partId);
        }

        return ResponseEntity.ok(favoriteItem);
    }

    @DeleteMapping("/{partId}")
    public ResponseEntity<Void> removeFavorite(
            @AuthenticationPrincipal User user,
            @PathVariable Integer partId
    ) {
        favoriteService.removeFavorite(user, partId);
        return ResponseEntity.noContent().build();
    }
}
