package com.windown.common;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ForwardController {

    @RequestMapping(value = "{path:^(?!api|actuator|static|assets|.*\\.[a-zA-Z0-9]$).*$}**")
    public String forward() {
        return "forward:/index.html";
    }
}
