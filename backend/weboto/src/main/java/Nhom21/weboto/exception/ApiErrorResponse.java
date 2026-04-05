package Nhom21.weboto.exception;

import java.util.List;
import java.util.Map;

public record ApiErrorResponse(
        int status,
        String code,
        String message,
        Map<String, List<String>> details
) {
}
