import NextLink from 'next/link';
import { Button } from '@chakra-ui/react';

export default function NavItem({ text, href, isActive }: { text: String, href: any, isActive: boolean }) {
  return (
    <NextLink href={href} passHref >
      <Button
        variant="ghost"
        aria-label="Home"
        my={3}
        w="100%"
        isActive={isActive}
      >
        {text}
      </Button>
    </NextLink>
  );
}