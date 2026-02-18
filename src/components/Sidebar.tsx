import { Link, useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { ConditionalWrapper } from './ConditionalWrapper';
import { Conversation } from '@shared/types';
import { AuthButton } from './auth/AuthButton';
import { ModeSwitcher } from './ModeSwitcher';
import { useMode } from '@/contexts/ModeContext';

interface SidebarProps {
  isSidebarOpen: boolean;
}

export function Sidebar({ isSidebarOpen }: SidebarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mode } = useMode();

  const { data: recentConversations } = useQuery<Conversation[]>({
    queryKey: ['conversations', 'recent', mode],
    initialData: [],
    queryFn: async () => {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false })
        .eq('user_id', user?.id ?? '')
        .eq('mode', mode)
        .limit(10);

      if (error) throw error;

      const conversationsWithTitles = await Promise.all(
        (conversations || []).map(async (conv) => {
          if (
            conv.title &&
            conv.title.toLowerCase() !== 'new conversation' &&
            conv.title.toLowerCase() !== 'untitled' &&
            conv.title.toLowerCase() !== 'conversation'
          ) {
            return conv;
          }

          const { data: messages } = await supabase
            .from('messages')
            .select('content')
            .eq('conversation_id', conv.id)
            .eq('role', 'user')
            .order('created_at', { ascending: true })
            .limit(1);

          if (messages && messages.length > 0) {
            const firstMessage = messages[0];
            let text = '';
            if (
              firstMessage.content &&
              typeof firstMessage.content === 'object' &&
              'text' in firstMessage.content
            ) {
              text = String(firstMessage.content.text || '');
            }
            const preview = text.substring(0, 40).trim();
            return {
              ...conv,
              title: preview || conv.title || 'Untitled Creation',
            };
          }

          return conv;
        }),
      );

      return conversationsWithTitles;
    },
  });

  return (
    <div
      className={`${isSidebarOpen ? 'w-64' : 'w-16'} flex h-full flex-shrink-0 flex-col bg-adam-bg-dark pb-2 transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 dark:border-gray-800">
        <ConditionalWrapper
          condition={!isSidebarOpen}
          wrapper={(children) => (
            <Tooltip>
              <TooltipTrigger asChild>{children}</TooltipTrigger>
              <TooltipContent side="right" className="flex flex-col">
                <span className="font-semibold">Home</span>
                <span className="text-xs text-muted-foreground">Home Page</span>
              </TooltipContent>
            </Tooltip>
          )}
        >
          <Link to="/">
            <div className="flex cursor-pointer items-center space-x-2">
              {isSidebarOpen ? (
                <div className="flex w-full items-center justify-center">
                  {mode === "architecture" ? (
                    <img
                      className="mx-auto h-12 w-full object-contain"
                      src={`${import.meta.env.BASE_URL}logos/parametrix-logo-full.svg`}
                      alt="Parametrix"
                    />
                  ) : (
                    <img
                      className="mx-auto h-8 w-full"
                      src={`${import.meta.env.BASE_URL}adam-logo-full.svg`}
                      alt="CADAM"
                    />
                  )}
                </div>
              ) : (
                <img
                  src={
                    mode === "architecture"
                      ? `${import.meta.env.BASE_URL}logos/parametrix-logo.svg`
                      : `${import.meta.env.BASE_URL}adam-logo.svg`
                  }
                  alt="Logo"
                  className={mode === "architecture" ? "h-9 w-9 min-w-9 rounded-md object-contain" : "h-8 w-8 min-w-8 object-contain"}
                />
              )}
            </div>
          </Link>
        </ConditionalWrapper>
      </div>

      {isSidebarOpen && (
        <div className="px-4 pb-3">
          <ModeSwitcher />
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className={`${isSidebarOpen ? 'px-4' : 'px-2'} flex-1 py-2 transition-all duration-300 ease-in-out`}
        >
          <ConditionalWrapper
            condition={!isSidebarOpen}
            wrapper={(children) => (
              <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side="right" className="flex flex-col">
                  <span className="font-semibold">New Creation</span>
                  <span className="text-xs text-muted-foreground">
                    Start a new conversation
                  </span>
                </TooltipContent>
              </Tooltip>
            )}
          >
            <div className="ml-[9px]">
              <Button
                variant="secondary"
                className={` ${
                  isSidebarOpen
                    ? `flex w-[216px] items-center justify-start gap-2 rounded-[100px] border bg-adam-background-1 px-4 py-3 text-[#D7D7D7] hover:text-adam-text-primary ${mode === 'architecture' ? 'border-[#C77DFF] hover:bg-[#C77DFF]/40' : 'border-adam-blue hover:bg-adam-blue/40'}`
                    : `flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border-2 bg-[#191A1A] p-[2px] text-[#D7D7D7] hover:text-adam-text-primary ${mode === 'architecture' ? 'border-[#C77DFF] shadow-[0px_4px_10px_0px_rgba(199,125,255,0.24)] hover:bg-[#C77DFF]/40' : 'border-adam-blue shadow-[0px_4px_10px_0px_rgba(0,166,255,0.24)] hover:bg-adam-blue/40'}`
                } mb-4`}
                onClick={() => navigate('/')}
              >
                <Plus
                  className={`h-5 w-5 ${!isSidebarOpen ? 'text-adam-neutral-300 hover:text-adam-text-primary' : ''}`}
                />
                {isSidebarOpen && (
                  <div className="text-sm font-semibold leading-[14px] tracking-[-0.14px] text-adam-neutral-200">
                    New Creation
                  </div>
                )}
              </Button>
            </div>
          </ConditionalWrapper>
          <nav className="space-y-1">
            {[
              {
                icon: LayoutGrid,
                label: 'Creations',
                href: '/history',
                description: 'View past creations',
                submenu: recentConversations,
              },
            ].map(({ icon: Icon, label, href, description, submenu }) => (
              <div key={label} className="space-y-1">
                <ConditionalWrapper
                  condition={!isSidebarOpen}
                  wrapper={(children) => (
                    <Tooltip>
                      <TooltipTrigger asChild>{children}</TooltipTrigger>
                      <TooltipContent side="right" className="flex flex-col">
                        <span className="font-semibold">{label}</span>
                        <span className="text-xs text-muted-foreground">
                          {description}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  )}
                >
                  <Link to={href}>
                    <Button
                      variant={
                        isSidebarOpen ? 'adam_dark' : 'adam_dark_collapsed'
                      }
                      className={`${isSidebarOpen ? 'w-full justify-start' : 'ml-[1px] h-[46px] w-[46px] p-0'}`}
                    >
                      <Icon
                        className={`${isSidebarOpen ? 'mr-2' : ''} h-[22px] w-[22px] min-w-[22px]`}
                      />
                      {isSidebarOpen && label}
                    </Button>
                  </Link>
                </ConditionalWrapper>
                {isSidebarOpen && submenu && (
                  <ul className="ml-7 flex list-none flex-col gap-1 border-l border-adam-neutral-500 px-2">
                    {submenu.map(
                      (
                        conversation: Omit<
                          Conversation,
                          'message_count' | 'last_message_at'
                        >,
                      ) => {
                        return (
                          <Link
                            to={`/editor/${conversation.id}`}
                            key={conversation.id}
                          >
                            <li key={conversation.id}>
                              <span className="line-clamp-1 text-ellipsis text-nowrap rounded-md p-1 text-xs font-medium text-adam-neutral-400 transition-colors duration-200 ease-in-out [@media(hover:hover)]:hover:bg-adam-neutral-950 [@media(hover:hover)]:hover:text-adam-neutral-10">
                                {conversation.title}
                              </span>
                            </li>
                          </Link>
                        );
                      },
                    )}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div
          className={`${isSidebarOpen ? 'px-4' : 'px-2'} py-2 transition-all duration-300 ease-in-out`}
        >
          <ConditionalWrapper
            condition={!isSidebarOpen}
            wrapper={(children) => (
              <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side="right" className="flex flex-col">
                  <span className="font-semibold">Instagram</span>
                  <span className="text-xs text-muted-foreground">
                    Follow us on Instagram
                  </span>
                </TooltipContent>
              </Tooltip>
            )}
          >
            <Link to="https://instagram.com/tanush_appapogu" target="_blank">
              <Button
                variant={isSidebarOpen ? 'adam_dark' : 'adam_dark_collapsed'}
                className={`${isSidebarOpen ? 'mb-1 w-full justify-start' : 'ml-[1px] h-[46px] w-[46px] p-0'}`}
              >
                <div
                  className={`${isSidebarOpen ? 'mr-2' : ''} h-[22px] w-[22px] min-w-[22px]`}
                >
                  <svg
                    role="img"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Instagram</title>
                    <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8504.6165 19.0872.321 18.2143.12 16.9366.0635 15.6588.0075 15.2479-.006 11.9999 0 8.7519.006 8.3408.0195 7.0689.0819L7.0301.084zm-.2191 2.033c1.2568-.0556 1.6439-.065 4.849-.0638 3.2032.0013 3.5894.0092 4.849.0647 1.1639.0533 1.797.2478 2.2174.4114.5573.2163.955.4749 1.3724.8924.4173.4177.6759.8163.8923 1.3744.1629.4198.3578 1.0536.4126 2.2192.0561 1.261.0652 1.6482.0641 4.8495-.001 3.2014-.0091 3.5884-.0649 4.849-.0541 1.163-.2489 1.7966-.4126 2.2167-.2167.5581-.4749.9574-.8924 1.3727-.4174.4165-.8162.6748-1.3744.892-.4188.163-1.0528.3579-2.218.4133-1.2607.056-1.6466.065-4.8488.0641-3.203-.001-3.5879-.0092-4.8488-.0648-1.1637-.054-1.7974-.2489-2.2178-.4134-.5575-.2168-.9566-.4749-1.3738-.8924-.4176-.4174-.6748-.8166-.8925-1.3747-.163-.4187-.3583-1.0526-.4131-2.2183-.0563-1.2607-.0653-1.6464-.0641-4.8488.0011-3.2026.0092-3.5883.0648-4.849.054-1.1637.2483-1.7968.4117-2.2175.2175-.5576.4754-.9558.8937-1.3733.4177-.4175.8167-.6752 1.3743-.893.4187-.163 1.0524-.358 2.2183-.4131zm9.7677 1.8756c-.7294 0-1.3204.5908-1.3204 1.3204 0 .7294.591 1.32 1.3204 1.32.7295 0 1.3203-.5906 1.3203-1.32 0-.7296-.5908-1.3204-1.3203-1.3204zM11.9984 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM11.9984 8a4 4 0 110 8 4 4 0 010-8z" />
                  </svg>
                </div>
                {isSidebarOpen && 'Instagram'}
              </Button>
            </Link>
          </ConditionalWrapper>
          <AuthButton isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
}
