package runus.runus.board.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import runus.runus.api.ApiResponse;
import runus.runus.board.dto.RegionMajorDTO;
import runus.runus.board.dto.RegionMinorDTO;
import runus.runus.board.service.RegionService;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class RegionController {

    @Autowired
    private RegionService regionService;

    @GetMapping("/region-major")
    public ResponseEntity<?> getMajorRegions() {
        List<RegionMajorDTO> regions = regionService.getAllMajorRegions();

        ApiResponse<List<RegionMajorDTO>> response = new ApiResponse<>();
        response.setSuccess(regions, "시도 목록 조회");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 안쓰긴함
    @GetMapping("/region-major/{majorId}")
    public ResponseEntity<?> getMinorRegions(@PathVariable int majorId) {
        List<RegionMinorDTO> regions = regionService.getMinorRegionsByMajorId(majorId);

        ApiResponse<List<RegionMinorDTO>> response = new ApiResponse<>();
        response.setSuccess(regions, "시군구 목록 조회");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/region-minor/{minorId}")
    public ResponseEntity<?> getMajorRegionByMinorId(@PathVariable int minorId) {
        RegionMinorDTO regionMinorDTO = regionService.getMajorRegionByMinorId(minorId);

        ApiResponse<RegionMinorDTO> response = new ApiResponse<>();
        response.setSuccess(regionMinorDTO, "시군구 상세 정보 조회");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
