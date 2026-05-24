package com.busbookingsystem.controller.api;

import com.busbookingsystem.dto.ApiDtos;
import com.busbookingsystem.service.DriverService;
import com.busbookingsystem.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DataApiController {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private DriverService driverService;

    @GetMapping("/vehicles")
    public List<ApiDtos.VehicleDto> vehicles() {
        return vehicleService.getAllVehicles().stream()
                .map(ApiDtos.VehicleDto::from)
                .toList();
    }

    @GetMapping("/drivers")
    public List<ApiDtos.DriverDto> drivers() {
        return driverService.getAllDrivers().stream()
                .map(ApiDtos.DriverDto::from)
                .toList();
    }
}
