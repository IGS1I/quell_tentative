import {
  Component,
  signal,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  HostListener,
  viewChild,
} from '@angular/core';
import Keyboard from 'simple-keyboard';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss',
})
export class KeyboardComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  protected readonly keyboardContainer = viewChild.required<ElementRef<HTMLDivElement>>('keyboardContainer');

  protected readonly visible = signal(false);
  protected readonly enabled = signal(true);

  private keyboard!: Keyboard;
  private activeInput: HTMLInputElement | HTMLTextAreaElement | null = null;

  constructor() {
    // Capture-phase listeners to prevent any click inside from stealing focus
    const prevent = (e: Event) => {
      console.log('[keyboard] capture prevent', e.type, (e.target as HTMLElement)?.tagName);
      e.preventDefault();
    };
    this.el.nativeElement.addEventListener('pointerdown', prevent, { capture: true });
    this.el.nativeElement.addEventListener('mousedown', prevent, { capture: true });
    this.el.nativeElement.addEventListener('touchstart', prevent, { capture: true });
  }

  ngAfterViewInit(): void {
    this.keyboard = new Keyboard(this.keyboardContainer().nativeElement, {
      onChange: (input) => this.onInputChange(input),
      onKeyPress: (button) => this.onKeyPress(button),
      preventMouseDownDefault: true,
      stopMouseDownPropagation: true,
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
  }

  ngOnDestroy(): void {
    this.keyboard?.destroy();
  }

  @HostListener('document:focusin', ['$event'])
  onFocusIn(e: FocusEvent): void {
    const target = e.target as HTMLElement;
    console.log('[keyboard] focusin', target.tagName, target.className, 'inside?', this.el.nativeElement.contains(target));
    if (this.el.nativeElement.contains(target)) return;

    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      const type = (target as HTMLInputElement).type;
      if (['text', 'search', 'url', 'tel', 'password', 'number', ''].includes(type) || target instanceof HTMLTextAreaElement) {
        this.activeInput = target;
        this.keyboard.setInput(target.value);
        if (this.enabled()) this.visible.set(true);
      }
    }
  }

  protected toggleKeyboard(): void {
    console.log('[keyboard] toggleKeyboard, currently visible:', this.visible());
    console.trace('[keyboard] toggle stack');
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
    this.activeInput.focus();
  }

  private onKeyPress(button: string): void {
    console.log('[keyboard] onKeyPress', button, 'visible:', this.visible());
    if (button === '{shift}' || button === '{lock}') {
      const currentLayout = this.keyboard.options.layoutName;
      this.keyboard.setOptions({
        layoutName: currentLayout === 'default' ? 'shift' : 'default',
      });
    }
    if (this.activeInput) {
      this.activeInput.focus();
    }
  }
}
