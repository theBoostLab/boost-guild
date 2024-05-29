import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { useParams } from 'next/navigation';

// import axios from 'axios';

async function getResponse(req: NextRequest, llama: { network: string, actionId: string }): Promise<NextResponse> {
    const body: FrameRequest = await req.json();
    const { isValid } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });
    if (isValid) {
        try {
            return new NextResponse(
                getFrameHtmlResponse({
                    buttons: [
                        {
                            label: 'Read Summary',
                        },
                        {
                            label: 'Go To Approved',
                            action: 'post_redirect'
                        }
                    ],
                    image: `${NEXT_PUBLIC_URL}/boost-pass-display.png`,
                    post_url: `${NEXT_PUBLIC_URL}/llama/${llama.network}/actions/${llama.actionId}`,
                    // post_url: `${NEXT_PUBLIC_URL}/api/end`
                }),
            );

           

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {
                    label: `Mint a new pass`,
                },
            ],
            image: `${NEXT_PUBLIC_URL}/boost-pass-disaplay.png`,
            post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        }),
    );
}

export async function POST(req: NextRequest): Promise<Response> {
    const params = useParams();
    const { network, actionId } = params
    const llama = { network, actionId } as { network: string, actionId: string }
    return getResponse(req, llama);
}

export const dynamic = 'force-dynamic';
