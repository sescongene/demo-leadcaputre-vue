import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from '../App.vue'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function buildWrapper() {
  return mount(App, {
    attachTo: document.body, // needed for :focus and form validation
  })
}

// ---------------------------------------------------------------------------
// 1. Rendering
// ---------------------------------------------------------------------------
describe('App – rendering', () => {
  it('renders the hero headline', () => {
    const wrapper = buildWrapper()
    expect(wrapper.text()).toContain('Unlock the Future of')
    expect(wrapper.text()).toContain('Your Business')
  })

  it('renders the form section heading', () => {
    const wrapper = buildWrapper()
    expect(wrapper.text()).toContain('Get Started Now')
  })

  it('renders all four form fields', () => {
    const wrapper = buildWrapper()
    expect(wrapper.find('#firstName').exists()).toBe(true)
    expect(wrapper.find('#lastName').exists()).toBe(true)
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#phone').exists()).toBe(true)
  })

  it('renders the submit button with correct initial label', () => {
    const wrapper = buildWrapper()
    const btn = wrapper.find('button[type="submit"]')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toContain('Sign Up Now')
  })

  it('does not show the success banner initially', () => {
    const wrapper = buildWrapper()
    expect(wrapper.text()).not.toContain("Successfully submitted")
  })

  it('does not show the error banner initially', () => {
    const wrapper = buildWrapper()
    expect(wrapper.find('[class*="red"]').exists()).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// 2. v-model / two-way binding
// ---------------------------------------------------------------------------
describe('App – form field binding', () => {
  it('updates firstName when user types', async () => {
    const wrapper = buildWrapper()
    const input = wrapper.find('#firstName')
    await input.setValue('Alice')
    expect((input.element as HTMLInputElement).value).toBe('Alice')
  })

  it('updates lastName when user types', async () => {
    const wrapper = buildWrapper()
    const input = wrapper.find('#lastName')
    await input.setValue('Smith')
    expect((input.element as HTMLInputElement).value).toBe('Smith')
  })

  it('updates email when user types', async () => {
    const wrapper = buildWrapper()
    const input = wrapper.find('#email')
    await input.setValue('alice@example.com')
    expect((input.element as HTMLInputElement).value).toBe('alice@example.com')
  })

  it('updates phone when user types', async () => {
    const wrapper = buildWrapper()
    const input = wrapper.find('#phone')
    await input.setValue('+1 555 000 0000')
    expect((input.element as HTMLInputElement).value).toBe('+1 555 000 0000')
  })
})

// ---------------------------------------------------------------------------
// 3. HTML5 required / type attributes
// ---------------------------------------------------------------------------
describe('App – field attributes', () => {
  it('firstName is marked as required', () => {
    const wrapper = buildWrapper()
    expect((wrapper.find('#firstName').element as HTMLInputElement).required).toBe(true)
  })

  it('lastName is marked as required', () => {
    const wrapper = buildWrapper()
    expect((wrapper.find('#lastName').element as HTMLInputElement).required).toBe(true)
  })

  it('email is marked as required and type="email"', () => {
    const wrapper = buildWrapper()
    const el = wrapper.find('#email').element as HTMLInputElement
    expect(el.required).toBe(true)
    expect(el.type).toBe('email')
  })

  it('phone is NOT marked as required', () => {
    const wrapper = buildWrapper()
    expect((wrapper.find('#phone').element as HTMLInputElement).required).toBe(false)
  })

  it('phone has type="tel"', () => {
    const wrapper = buildWrapper()
    expect((wrapper.find('#phone').element as HTMLInputElement).type).toBe('tel')
  })
})

// ---------------------------------------------------------------------------
// 4. Successful submission flow
// ---------------------------------------------------------------------------
describe('App – successful form submission', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response)
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls fetch with correct URL and method on submit', async () => {
    const wrapper = buildWrapper()
    await wrapper.find('#firstName').setValue('Alice')
    await wrapper.find('#lastName').setValue('Smith')
    await wrapper.find('#email').setValue('alice@example.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('bot.mandalanarratives.com')
    expect(options.method).toBe('POST')
    expect(options.headers).toMatchObject({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
  })

  it('sends correct JSON body with form data', async () => {
    const wrapper = buildWrapper()
    await wrapper.find('#firstName').setValue('Alice')
    await wrapper.find('#lastName').setValue('Smith')
    await wrapper.find('#email').setValue('alice@example.com')
    await wrapper.find('#phone').setValue('+1 555 000 0000')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string)
    expect(body).toEqual({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      phone: '+1 555 000 0000',
    })
  })

  it('shows the success banner after a successful submission', async () => {
    const wrapper = buildWrapper()
    await wrapper.find('#firstName').setValue('Alice')
    await wrapper.find('#lastName').setValue('Smith')
    await wrapper.find('#email').setValue('alice@example.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain("Successfully submitted")
  })

  it('clears form fields after a successful submission', async () => {
    const wrapper = buildWrapper()
    await wrapper.find('#firstName').setValue('Alice')
    await wrapper.find('#lastName').setValue('Smith')
    await wrapper.find('#email').setValue('alice@example.com')
    await wrapper.find('#phone').setValue('+1 555 000 0000')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect((wrapper.find('#firstName').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#lastName').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#email').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#phone').element as HTMLInputElement).value).toBe('')
  })

  it('does not show an error message after a successful submission', async () => {
    const wrapper = buildWrapper()
    await wrapper.find('#firstName').setValue('Alice')
    await wrapper.find('#lastName').setValue('Smith')
    await wrapper.find('#email').setValue('alice@example.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // No red-coloured alert should be visible
    const errorBanner = wrapper.find('[class*="red-400"]')
    expect(errorBanner.exists()).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// 5. Failed submission flow
// ---------------------------------------------------------------------------
describe('App – failed form submission', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows error banner when network response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false } as Response))

    const wrapper = buildWrapper()
    await wrapper.find('#firstName').setValue('Alice')
    await wrapper.find('#lastName').setValue('Smith')
    await wrapper.find('#email').setValue('alice@example.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to submit form. Please try again.')
  })

  it('shows error banner when fetch throws a network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const wrapper = buildWrapper()
    await wrapper.find('#firstName').setValue('Alice')
    await wrapper.find('#lastName').setValue('Smith')
    await wrapper.find('#email').setValue('alice@example.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to submit form. Please try again.')
  })

  it('does NOT show success banner after a failed submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))

    const wrapper = buildWrapper()
    await wrapper.find('#firstName').setValue('Alice')
    await wrapper.find('#lastName').setValue('Smith')
    await wrapper.find('#email').setValue('alice@example.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).not.toContain('Successfully submitted')
  })
})

// ---------------------------------------------------------------------------
// 6. Submit button disabled state
// ---------------------------------------------------------------------------
describe('App – submitting state', () => {
  it('disables the submit button while the request is in flight', async () => {
    // keep the promise pending so we can check the intermediate state
    let resolveRequest!: (value: Response) => void
    const pending = new Promise<Response>((res) => { resolveRequest = res })
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(pending))

    const wrapper = buildWrapper()
    await wrapper.find('#firstName').setValue('Alice')
    await wrapper.find('#lastName').setValue('Smith')
    await wrapper.find('#email').setValue('alice@example.com')

    // start submit (don't await yet)
    wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    const btn = wrapper.find('button[type="submit"]')
    expect(btn.attributes('disabled')).toBeDefined()

    // clean up
    resolveRequest({ ok: true } as Response)
    await flushPromises()
    vi.restoreAllMocks()
  })

  it('shows "Processing..." label while submitting', async () => {
    let resolveRequest!: (value: Response) => void
    const pending = new Promise<Response>((res) => { resolveRequest = res })
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(pending))

    const wrapper = buildWrapper()
    await wrapper.find('#firstName').setValue('Alice')
    await wrapper.find('#lastName').setValue('Smith')
    await wrapper.find('#email').setValue('alice@example.com')

    wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Processing...')

    resolveRequest({ ok: true } as Response)
    await flushPromises()
    vi.restoreAllMocks()
  })

  it('re-enables the submit button after submission completes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true } as Response))

    const wrapper = buildWrapper()
    await wrapper.find('#firstName').setValue('Alice')
    await wrapper.find('#lastName').setValue('Smith')
    await wrapper.find('#email').setValue('alice@example.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
    vi.restoreAllMocks()
  })
})
