package dev.thesphere.quell.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class CompletableItem {

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private boolean done;

    public CompletableItem() {}

    public CompletableItem(String label, boolean done) {
        this.label = label;
        this.done = done;
    }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }
}
