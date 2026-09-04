package com.windown.common;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ForwardController {

    @GetMapping({
        "/",
        "/login",
        "/dashboard",
        "/projects/**",
        "/workers/**",
        "/attendance/**",
        "/payroll/**",
        "/finance/**",
        "/schedule/**",
        "/warranty/**",
        "/warehouse/**",
        "/settings/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
