import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ArtworkCard from '../components/ArtworkCard'

const BASE_PROPS = {
  id: 42,
  title: 'Starry Night',
  artistName: 'Vincent van Gogh',
  objectDate: '1889',
  thumbnailUrl: 'https://example.com/small.jpg',
}

describe('ArtworkCard', () => {
  it('renders title, artist name and object date', () => {
    render(<ArtworkCard {...BASE_PROPS} />)

    expect(screen.getByText('Starry Night')).toBeInTheDocument()
    expect(screen.getByText('Vincent van Gogh')).toBeInTheDocument()
    expect(screen.getByText('1889')).toBeInTheDocument()
  })

  it('renders the thumbnail image when thumbnailUrl is provided', () => {
    render(<ArtworkCard {...BASE_PROPS} />)

    const img = screen.getByRole('img', { name: 'Starry Night' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/small.jpg')
  })

  it('renders placeholder icon when thumbnailUrl is null', () => {
    const { container } = render(<ArtworkCard {...BASE_PROPS} thumbnailUrl={null} />)

    expect(screen.queryByRole('img', { name: 'Starry Night' })).not.toBeInTheDocument()
    // MUI SvgIcon renders as svg
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('calls onClick with the artwork id when card is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<ArtworkCard {...BASE_PROPS} onClick={onClick} />)

    await user.click(screen.getByText('Starry Night'))
    expect(onClick).toHaveBeenCalledOnce()
    expect(onClick).toHaveBeenCalledWith(42)
  })

  it('does not throw when onClick is not provided', async () => {
    const user = userEvent.setup()
    render(<ArtworkCard {...BASE_PROPS} />)

    await expect(user.click(screen.getByText('Starry Night'))).resolves.not.toThrow()
  })

  it('renders "Untitled" title correctly', () => {
    render(<ArtworkCard {...BASE_PROPS} title="Untitled" />)
    expect(screen.getByText('Untitled')).toBeInTheDocument()
  })

  it('renders "Unknown Artist" correctly', () => {
    render(<ArtworkCard {...BASE_PROPS} artistName="Unknown Artist" />)
    expect(screen.getByText('Unknown Artist')).toBeInTheDocument()
  })
})
