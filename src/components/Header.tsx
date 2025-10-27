import { Separator } from '@radix-ui/themes';
import Image from 'next/image';
import Link from 'next/link';
import { MADE_BY_URL } from '@/utils/env';

const Header = () => {
  return (
    <header className="relative top-0 z-50 bg-white shadow h-16">
      <div className="relative py-2 h-full flex items-center justify-between px-4">
        <div className="z-1 flex h-full flex-row items-center gap-4 group hover:cursor-pointer">
          <Link href="/" aria-label="Go to Wonderful Quran home">
            <Image
              src="/assets/icons/wonderful_quran.svg"
              alt="Wonderful Quran"
              className="h-16 w-28"
              priority={true}
              width={112}
              height={64}
              fetchPriority="high"
            />
          </Link>
          <Separator className="h-16 w-px bg-black" decorative orientation="vertical" />
          <Link
            href={MADE_BY_URL}
            aria-label="Go to Developer Site"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src="/assets/icons/hdygidev.svg"
              alt="HDygiDev"
              className="h-16 w-24"
              width={96}
              height={64}
              fetchPriority="high"
            />
          </Link>
        </div>
        {/* TODO: Add search feature later */}
        {/* <div className="z-0 absolute left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-row items-center justify-center">
          <TextField.Root placeholder="Keyword..." variant="classic" className="w-1/2" size="3">
            <TextField.Slot side="left" pl={'0'}>
              <Select.Root defaultValue="quran" size="3">
                <Select.Trigger
                  variant="classic"
                  className="!rounded-r-none"
                  aria-label="Search by"
                />
                <Select.Content variant="solid">
                  <Select.Group>
                    <Select.Label>Search by</Select.Label>
                    <Select.Item value="quran">Quran</Select.Item>
                    <Select.Item value="hadith" disabled>
                      Hadith (Coming Soon)
                    </Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </TextField.Slot>
          </TextField.Root>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
