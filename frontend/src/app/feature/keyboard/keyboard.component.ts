import {
  Component,
  signal,
  OnDestroy,
  ElementRef,
  inject,
  HostListener,
  effect,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import Keyboard from 'simple-keyboard';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss',
})
export class KeyboardComponent implements OnDestroy {
  private readonly doc = inject(DOCUMENT);
  private readonly el = inject(ElementRef);

  protected readonly keyboardContainer = viewChild<ElementRef<HTMLDivElement>>('keyboardContainer');

  protected readonly visible = signal(false);
  protected readonly enabled = signal(true);

  private keyboard: Keyboard | null = null;
  private activeInput: HTMLInputElement | HTMLTextAreaElement | null = null;

  constructor() {
    // Re-create simple-keyboard each time the container appears/disappears
    effect(() => {
      const ref = this.keyboardContainer();
      if (ref) {
        this.keyboard = new Keyboard(ref.nativeElement, {
          onChange: (input) => this.onInputChange(input),
          onKeyPress: (button) => this.onKeyPress(button),
          mergeDisplay: true,
          display: {
            '{bksp}': '⌫',
            '{enter}': '↵',
            '{shift}': '⇧',
            '{space}': ' ',
            '{tab}': '⇥',
            '{lock}': '⇪',
          },
        });
        if (this.activeInput) {
          this.keyboard.setInput(this.activeInput.value);
        }
      } else {
        this.keyboard?.destroy();
        this.keyboard = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.keyboard?.destroy();
  }

  @HostListener('document:focusin', ['$event'])
  onFocusIn(e: FocusEvent): void {
    const target = e.target as HTMLElement;
    if (this.el.nativeElement.contains(target)) return;

    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      const type = (target as HTMLInputElement).type;
      if (['text', 'search', 'url', 'tel', 'password', 'number', ''].includes(type) || target instanceof HTMLTextAreaElement) {
        this.activeInput = target;
        this.keyboard?.setInput(target.value);
        if (this.enabled()) this.visible.set(true);
      }
    }
  }

  @HostListener('document:focusout', ['$event'])
  onFocusOut(e: FocusEvent): void {
    const related = e.relatedTarget as HTMLElement | null;
    if (related && this.el.nativeElement.contains(related)) return;

    setTimeout(() => {
      if (this.el.nativeElement.contains(this.doc.activeElement)) return;
      if (this.doc.activeElement === this.activeInput) return;
      this.activeInput = null;
      this.visible.set(false);
    }, 150);
  }

  protected toggleKeyboard(): void {
    if (this.visible()) {
      this.visible.set(false);
      this.enabled.set(false);
    } else {
      this.enabled.set(true);
      if (this.activeInput) this.visible.set(true);
    }
  }

  private onInputChange(input: string): void {
    if (!this.activeInput) return;

    const nativeInputValueSetter =
      Object.getOwnPropertyDescriptor(
        this.activeInput instanceof HTMLTextAreaElement
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype,
        'value',
      )?.set;

    nativeInputValueSetter?.call(this.activeInput, input);
    this.activeInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private onKeyPress(button: string): void {
    if (button === '{shift}' || button === '{lock}') {
      const currentLayout = this.keyboard?.options.layoutName;
      this.keyboard?.setOptions({
        layoutName: currentLayout === 'default' ? 'shift' : 'default',
      });
    }
    if (button === '{enter}' && this.activeInput) {
      this.activeInput.focus();
    }
  }
}
