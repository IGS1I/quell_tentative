package dev.thesphere.quell.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
@Profile("local")
public class LocalDataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(LocalDataSourceConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(
            @Value("${spring.datasource.url}") String postgresUrl,
            @Value("${spring.datasource.username}") String username,
            @Value("${spring.datasource.password}") String password) {

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(postgresUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("org.postgresql.Driver");
        config.setConnectionTimeout(3_000);
        config.setInitializationFailTimeout(-1);

        HikariDataSource ds = new HikariDataSource(config);
        try (Connection conn = ds.getConnection()) {
            log.info("PostgreSQL is available, using {}", postgresUrl);
            return ds;
        } catch (Exception e) {
            ds.close();
            log.warn("PostgreSQL unavailable ({}), falling back to H2 in-memory database", e.getMessage());
        }

        return new EmbeddedDatabaseBuilder()
                .setType(EmbeddedDatabaseType.H2)
                .setName("quell")
                .build();
    }
}
