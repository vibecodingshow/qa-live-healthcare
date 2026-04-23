package com.leansofx.qaservicequestion;

import org.springframework.boot.SpringApplication;

public class TestQaServiceQuestionApplication {

	public static void main(String[] args) {
		SpringApplication.from(QaServiceQuestionApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
